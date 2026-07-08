import { Directive, input } from "@angular/core";

@Directive()
export abstract class TerminalBase {
  welcomeMessage = input<string>("Bienvenido");
  prompt = input<string>("$ ");
}
