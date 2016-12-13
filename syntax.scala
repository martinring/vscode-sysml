#!/bin/sh
exec scala -savecompiled "$0" "$@"
!#

import scala.io.Source
import scala.util.matching.Regex
import java.io.{PrintWriter,File}

def escape(raw: String): String = {
	import scala.reflect.runtime.universe._
	Literal(Constant(raw)).toString
}

val source = Source.fromFile("src/syntaxes/sysml.json")
val writer = new PrintWriter(new File("syntaxes/sysml.json"))

val regexRegex = raw"(\:\s*)/((?:\\/|[^/])+)/".r
val variableRegex = raw"^//\s*([a-z0-9]+)\s*=\s*/(.*)/\s*$$".r
val substitutions = collection.mutable.Map.empty[String,String]

source.getLines.foreach {
	case variableRegex(name,value) =>
	  substitutions += name -> substitutions.foldLeft(value) {
			case (line,(from,to)) =>
			  line.replaceAll("@" + from,Regex.quoteReplacement(to))
		}
	case line =>
	  val subst = substitutions.foldLeft(line) {
			case (line,(from,to)) =>
			  line.replaceAll("@" + from,Regex.quoteReplacement(to))
		}
		val escaped =
		regexRegex.replaceAllIn(subst,m => Regex.quoteReplacement(m.group(1) + escape(m.group(2))))
	  writer.println(escaped)
}

println(substitutions)

writer.close()