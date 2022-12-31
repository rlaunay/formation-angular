import set from "lodash/set";

/**
 * Permet de lier une propriété de ma directive à une propriété de l'élément HTML auquel la directive est lié
 * 
 * Exemple #1
 * @HostBinding('placeholder')
 * placehoderText = "hello world";
 * 
 * Exemple #2
 * @HostBinding('style.color')
 * color = "red";
 * 
 * @param attrName L'attribut que l'on souhaite lier à la propriété de la directive
 */
export function HostBinding(attrName: string) {
  return function(decoratedClass: any, propName: string) {
    const originalInitFunction: Function = decoratedClass['init'] || function() {};

    const bindings: any[] = decoratedClass["bindings"] || []
    bindings.push({ attrName, propName });
    decoratedClass["bindings"] = bindings;
    
    decoratedClass['init'] = function() {
      originalInitFunction.call(this);

      set(this.element, attrName, this[propName]);
    }
  }
}