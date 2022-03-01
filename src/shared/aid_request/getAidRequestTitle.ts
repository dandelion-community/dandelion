type SharedAidRequestType = {
  whoIsItFor: string;
  whatIsNeeded: string;
};

export default function getAidRequestTitle({
  whoIsItFor,
  whatIsNeeded,
}: SharedAidRequestType): string {
  return `${whatIsNeeded} for ${whoIsItFor}`;
}
