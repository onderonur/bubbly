import { FormikConfig } from 'formik';
import { ID } from '@shared/SharedTypes';

export interface SocketUser {
  id: ID;
  username: string;
  socketIds: ID[];
  color: string;
}

export type OnSubmitFn<Values> = FormikConfig<Values>['onSubmit'];
