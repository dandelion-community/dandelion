type Args = {
  whoIsItForSingle: string | undefined | null;
  whoIsItForMulti: string[] | undefined | null;
};

export default function resolveWhoIsItFor({
  whoIsItForSingle,
  whoIsItForMulti,
}: Args): string[] {
  if (whoIsItForMulti != null) {
    return whoIsItForMulti;
  } else if (whoIsItForSingle != null) {
    return [whoIsItForSingle];
  } else {
    throw new Error(
      'Must provide either whoIsItFor or whoIsItForMulti to createAidRequests',
    );
  }
}
