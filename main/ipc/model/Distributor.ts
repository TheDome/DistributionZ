export default class Distributor {
  public name!: string;

  constructor(private distName: string) {
    this.name = distName;
  }
}
