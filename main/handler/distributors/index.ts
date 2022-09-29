import Distributor from "./Distributor";
import RandomDistributor from "./RandomDistributor";

export function listDistributors(): Distributor[] {
  return [new RandomDistributor()];
}
