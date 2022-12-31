/**
 * Permet de récupérer une information dans un attribut de l'élément auquel est rattachée une directive
 * @param attrName l'attribut dans lequel on veut récupérer une information
 */
export function Input(attrName: string) {
  return function (decoratedClass: any, propName: string) {
    const originalInitFunction: Function = decoratedClass["init"] || function() { }
    
    decoratedClass["init"] = function () {
      if (this.element.hasAttribute(`[${attrName}]`)) {
        this.willHaveSpaces = this.element.getAttribute(`[${attrName}]`) === "true";
      }

      if (this.element.hasAttribute(attrName)) {
        this[propName] = this.element.getAttribute(attrName)!;
      }

      originalInitFunction.call(this);
    }

  }
}