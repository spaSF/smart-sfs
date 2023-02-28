isc.RPCManager.defaultTimeout = 1200000;
isc.SimpleType.getType("integer").validOperators = [ "equals", "notEqual", "greaterThan", "lessThan", "greaterOrEqual", "lessOrEqual",
      "isNull", "notNull", "between", "betweenInclusive", "equalsField", "notEqualField", "greaterThanField", "lessThanField",
      "greaterOrEqualField", "lessOrEqualField" ];
isc.SimpleType.getType("date").validOperators = [ "equals", "notEqual", "greaterThan", "lessThan", "greaterOrEqual", "lessOrEqual",
      "isNull", "notNull", "between", "betweenInclusive", "equalsField", "notEqualField", "greaterThanField", "lessThanField",
      "greaterOrEqualField", "lessOrEqualField" ];
isc.SimpleType.getType("datetime").validOperators = [ "equals", "notEqual", "greaterThan", "lessThan", "greaterOrEqual", "lessOrEqual",
      "isNull", "notNull", "between", "betweenInclusive", "equalsField", "notEqualField", "greaterThanField", "lessThanField",
      "greaterOrEqualField", "lessOrEqualField" ];
isc.SimpleType.getType("time").validOperators = [ "equals", "notEqual", "greaterThan", "lessThan", "greaterOrEqual", "lessOrEqual",
      "isNull", "notNull", "between", "betweenInclusive", "equalsField", "notEqualField", "greaterThanField", "lessThanField",
      "greaterOrEqualField", "lessOrEqualField" ];
isc.SimpleType.getType("float").validOperators = [ "equals", "notEqual", "greaterThan", "lessThan", "greaterOrEqual", "lessOrEqual",
      "isNull", "notNull", "between", "betweenInclusive", "equalsField", "notEqualField", "greaterThanField", "lessThanField",
      "greaterOrEqualField", "lessOrEqualField" ];
isc.SimpleType.getType("localeFloat").validOperators = [ "equals", "notEqual", "greaterThan", "lessThan", "greaterOrEqual", "lessOrEqual",
      "isNull", "notNull", "between", "betweenInclusive", "equalsField", "notEqualField", "greaterThanField", "lessThanField",
      "greaterOrEqualField", "lessOrEqualField" ];
isc.SimpleType.getType("localeCurrency").validOperators = [ "equals", "notEqual", "greaterThan", "lessThan", "greaterOrEqual",
      "lessOrEqual", "isNull", "notNull", "between", "betweenInclusive", "equalsField", "notEqualField", "greaterThanField",
      "lessThanField", "greaterOrEqualField", "lessOrEqualField" ];
isc.SimpleType.getType("text").validOperators = [ "equals", "notEqual", "greaterThan", "lessThan", "greaterOrEqual", "lessOrEqual",
      "isNull", "notNull", "between", "betweenInclusive", "equalsField", "notEqualField", "greaterThanField", "lessThanField",
      "greaterOrEqualField", "lessOrEqualField", "iEquals", "iNotEqual", "startsWith", "notStartsWith", "iNotStartsWith", "iStartsWith",
      "iEndsWith", "endsWith", "notEndsWith", "iNotEndsWith", "iContains", "iContainsPattern", "contains", "notContains", "iNotContains",
      "iBetweenInclusive","and","not","or" ];
console.log("This is my javascript manifest");
// isc.Canvas.resizeFonts(-1); //da sa zmenit velkost vsetkych fontov naraz o
// zadane cislo
/**
 * CustomComponents class pre vytvorenie custom komponentov
 * invokeCompMethod :funkcia vytvorenia komponentu gridu
 *  -musia byt class metodami 
 *  -obdrzi parametre - tabSet (do ktoreho tabsetu umiestnit), type (typ gridu) a dataSource
 *  -musia vratit vytvoreny komponent
 * invokeDetailCompMethod: funkcia vytvorenia detail komponentu, parametre:
 *  - meno komponent fcie
 *  - params objekt s parametrami detail componentu
 */
isc.defineClass("CustomComponents").addClassProperties({
   invokeCompMethod : function(component, tabSet, type, dSource, callBack) {
      var compFn = CustomComponents[component];
      if (isA.Function(compFn)) {
         if (isA.String(dSource)) {
            App.getDataSource(dSource, function(DS) {
               callBack(compFn(tabSet, type, DS), DS);
            });
         } else
            callBack(compFn(tabSet, type, dSource), dSource);
      } else {
         isc.logWarn("Nedefinovana custom component fncia " + component);
      }
   },
   invokeDetailCompMethod : function(component, paramsObj){
	   var compFn = CustomComponents[component];
      if (isA.Function(CustomComponents[component])) {
    	  return compFn(paramsObj);
      }else {
          isc.logWarn("Nedefinovana custom component fncia " + component);
      }
   },
   fileTestComp : function(tabSet, type, dSource) {
      return GridComponentAny.create({
         dataSource : dSource,
         tabSet : tabSet,
         type : type
      });
   },
   calendarComp : function(tabSet, type, dSource) {
      return SmartCalendarTemplate.create({
         dataSource : dSource,
         tabSet : tabSet,
         type : type
      });
   },
   detailFileTest : function(params){
	   return DetailFormComponentAny.create(params);
   }
});
