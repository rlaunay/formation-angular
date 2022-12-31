/**
 * Permet de lier une méthode de la directive à un événement qui aura lieu sur l'élément HTML
 * 
 * @param eventName L'événement auquel on souhaite réagir et lier la méthode
 * @param params Un tableau des paramètres dont on a besoin;
 * Par exemple:
 * 
 * @HostListener('click', 'event.target')
 * onClick(target) {}
 */
export function HostListener(eventName: string, params: (string|number)[] = []) {
  return function(decoratedClass: any, methodName: string) {
    const originalInitFunction: Function = decoratedClass['init'] || function() {};

    decoratedClass['init'] = function() {
      originalInitFunction.call(this);

      // @ts-ignore
      this.element.addEventListener(eventName, (event: any) => {
        const paramsToSend = params.map(param => eval(param.toString()));
        this[methodName](...paramsToSend);
      })
    }
  }
}