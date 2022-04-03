import { ApolloError, TypedDocumentNode, useMutation } from '@apollo/client';
import ToastStore from 'src/client/toast/ToastStore';
import { tryCatchAsync } from '../error/tryCatch';

type Args<TData, TVariables> = {
  errorMessage: string;
  mutation: TypedDocumentNode<TData, TVariables>;
  onSuccess?: () => Promise<void>;
  successMessage: string;
  variables?: TVariables;
};

export type ReturnValues<TVariables> = {
  mutate: (variables_?: undefined | TVariables) => Promise<unknown>;
  loading: boolean;
  error: ApolloError | undefined;
};

export default function useMutateWithToast<TData, TVariables>({
  errorMessage,
  mutation,
  onSuccess,
  successMessage,
  variables: hookVaribles,
}: Args<TData, TVariables>): ReturnValues<TVariables> {
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
    tryCatchAsync({
      run: async (): Promise<void> => {
        ToastStore.update(undefined);
        await runMutation({ variables });
        ToastStore.update({
          message: successMessage,
        });
        await onSuccess?.();
      },
      valueOnErrorFn: async (): Promise<void> => {
        ToastStore.update({
          message: errorMessage,
          retry: () => mutate(argVariables),
        });
      },
    });
  }
}
