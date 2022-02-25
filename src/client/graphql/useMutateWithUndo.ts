import { ApolloError, TypedDocumentNode, useMutation } from '@apollo/client';
import client from 'src/client/graphql/client';
import ToastStore from 'src/client/toast/ToastStore';

type PayloadWithUndo<TObject> = {
  object: TObject | null;
  undoID: string | null;
  postpublishSummary: string | null;
};

type DataWithUndo<TObject> = {
  payload: PayloadWithUndo<TObject> | null;
};

type VariablesWithUndo = {
  undoID?: string | null;
};

type Args<
  TObject,
  TData extends DataWithUndo<TObject>,
  TVariables extends VariablesWithUndo,
> = {
  broadcastResponse: (object: TObject | null) => void;
  clearInputs?: () => void;
  mutation: TypedDocumentNode<TData, TVariables>;
  variables?: TVariables;
};

export type ReturnValues<TVariables> = {
  mutate: (variables_?: undefined | TVariables) => Promise<unknown>;
  loading: boolean;
  error: ApolloError | undefined;
};

export default function useMutateWithUndo<
  TObject,
  TData extends DataWithUndo<TObject>,
  TVariables,
>({
  broadcastResponse,
  clearInputs,
  mutation,
  variables: hookVaribles,
}: Args<TObject, TData, TVariables>): ReturnValues<TVariables> {
  const [runMutation, { error, loading }] = useMutation<TData, TVariables>(
    mutation,
  );
  return {
    error,
    loading,
    mutate,
  };

  async function mutate(
    argVariables: undefined | TVariables = undefined,
  ): Promise<void> {
    const variables = argVariables ?? hookVaribles;
    const { data } = await runMutation({ variables });
    const payload = data?.payload;
    const object = payload?.object;
    clearInputs?.();
    broadcastResponse(object ?? null);
    if (payload != null) {
      const { undoID, postpublishSummary } = payload;
      ToastStore.update({
        message: postpublishSummary || 'Updated',
        undo:
          undoID == null || variables == null
            ? null
            : async () => {
                const { data } = await client.mutate({
                  mutation,
                  variables: { ...variables, undoID },
                });
                const payload = data?.payload;
                const object = payload?.object;
                broadcastResponse(object ?? null);
              },
      });
    }
  }
}
