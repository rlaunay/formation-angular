import { Module, ProvidersMetadata, ServiceInstances } from './types';
import { Detector } from './change-detector';
import { NgZone } from './zone';

/**
 * La classe qui représente notre framework. Son but est de facilement connaître l'ensemble des directives
 * et providers existants et de faire la connexion entre toutes nos directives et les éléments de la page
 */
export class Framework {
  /**
   * Un tableau qui contient l'ensemble des directives créées par les devs du projet
   */
  directives: any[] = [];
  /**
   * Un tableau qui contient l'ensemble des définitions se services dont dépendent les directives
   */
  providers: ProvidersMetadata = [];
  /**
   * Un tableau qui contient les services déjà instanciés afin de ne pas les réinstancier indéfiniment
   */
  services: ServiceInstances = [];

  /**
   * Permet de lancer l'application qui va brancher chaque directive aux éléments ciblés
   * @param metadata Un objet qui contient les informations utilses : les directives et les providers
   */
  bootstrapApplication(metadata: Module) {
    this.directives = metadata.declarations;
    this.providers = metadata.providers || [];

    NgZone.run(() => {
      this.directives.forEach((directive) => {
        const elements = document.querySelectorAll<HTMLElement>(
          directive.selector
        );
  
        elements.forEach((element) => {

          const params = this.analyseDirectiveConstructor(directive, element);

          const directiveInstance: any = Reflect.construct(directive, params);
          
          const proxy = new Proxy(directiveInstance, {
            set(target, propName, value, _) {
              target[propName] = value;
  
              if (!target.bindings) return true;
  
              const binding = target.bindings.find((b: any) => b.propName === propName)
              if (!binding) return true;
  
              Detector.addBinding(element, binding.attrName, value)
              return true
            }
          })
          
          proxy.init();
        });
      });
    })
    
  }

  /**
   * Analyse le constructeur d'une directive et nous donne les paramètres à passer à son constructeur
   *
   * @param directive La classe de la Directive qui nous intéresse
   * @param element L'élement HTML auquel la directive devait être greffée
   * @returns Un tableau des paramètres à donner au constructeur de la Directive
   */
  private analyseDirectiveConstructor(directive: any, element: HTMLElement) {
    const hasConstructor = /constructor\(.*?\)/g.test(directive.toString());
    if (!hasConstructor) {
      return [];
    }

    const paramsNames = this.extractParamNamesFromDirective(directive);

    const params = paramsNames.map((name) => {
      if (name === "element") {
        return element;
      }

      const directiveProviders = directive.providers || [];
      const directiveProvider = directiveProviders.find(
        (p: any) => p.provide === name
      );

      if (directiveProvider) {
        return directiveProvider.construct();
      }

      const service = this.services.find((s) => s.name === name);
      if (service) {
        return service.instance;
      }

      const provider = this.providers.find((p) => p.provide === name);

      if (!provider) {
        throw new Error(
          `Le service ${name} n'a pas pu être construit, aucun fournisseur n'a été défini pour la framework ou la directive elle même`
        );
      }

      const instance = provider.construct();

      this.services.push({
        name,
        instance,
      });

      return instance;
    });

    return params;
  }

  /**
   * Analyse un constructeur et retourne un tableau avec les nom des paramètres du constructeur
   *
   * @param directive La classe de la directive dont on veut vérifier les paramètres du constructeur
   * @returns Un tableau de chaînes de caractères représantant les noms des paramètres du constructeur
   */
  private extractParamNamesFromDirective(directive: any) {
    const params = /constructor\((.*)\)/g.exec(directive.toString());

    if (!params) {
      return [];
    }

    return params[1].split(", ");
  }
}

/**
 * On exporte une constante déjà créée pour faciliter encore plus l'utilisation du Framework
 * Les dévs n'ont même pas besoin de l'instancier, c'est déjà fait.
 */
export const Angular = new Framework();