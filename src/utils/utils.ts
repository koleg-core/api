export class Utils {

  public static normalize(inputStr: string): string {
    return inputStr.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }
}