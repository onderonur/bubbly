import React, { useMemo, useCallback } from 'react';
import { DialogActions, Button } from '@material-ui/core';
import { SocketUser, ID } from 'types';
import { Formik, FormikConfig } from 'formik';
import * as Yup from 'yup';
import { trimString } from 'utils';
import BaseTextField from 'components/BaseTextField';
import BaseModalForm from 'components/BaseModalForm';
import useSocketIo from 'contexts/SocketContext';
import Stack from 'components/Stack';
import BaseColorPicker from 'components/BaseColorPicker';
import BaseDialog from 'components/BaseDialog';
import BaseDialogTitle from 'components/BaseDialogTitle';
import BaseDialogContent from 'components/BaseDialogContent';
import SubmitButton from 'components/SubmitButton';

interface RoomUserFormValues {
  username: string;
  color: string;
}

const VALIDATION_SCHEMA = Yup.object().shape<RoomUserFormValues>({
  username: Yup.string().label('Username').required().transform(trimString),
  color: Yup.string().label('Color').required(),
});

interface RoomUserFormModalProps {
  roomUser: SocketUser;
  roomId: ID;
  open: boolean;
  onClose: VoidFunction;
}

const RoomUserFormModal = React.memo<RoomUserFormModalProps>(
  function RoomUserFormModal({ roomUser, roomId, open, onClose }) {
    const initialValues = useMemo<RoomUserFormValues>(
      () => ({ username: roomUser.username, color: roomUser.color }),
      [roomUser]
    );

    const io = useSocketIo();

    const handleSubmit = useCallback<
      FormikConfig<RoomUserFormValues>['onSubmit']
    >(
      (values, formikHelpers) => {
        const editedUser = { ...roomUser, ...values };
        io?.emit('edit user', roomId, editedUser);
        formikHelpers.setSubmitting(false);
        onClose();
      },
      [io, roomId, roomUser, onClose]
    );

    return (
      <BaseDialog open={open} onClose={onClose} fullWidth responsive>
        <BaseDialogTitle>User Settings</BaseDialogTitle>
        <Formik<RoomUserFormValues>
          initialValues={initialValues}
          validationSchema={VALIDATION_SCHEMA}
          validateOnMount
          onSubmit={handleSubmit}
        >
          {() => {
            return (
              <BaseModalForm>
                <BaseDialogContent>
                  <Stack flexDirection="column" spacing={2}>
                    <BaseTextField
                      name="username"
                      label="Username"
                      required
                      autoFocus
                      fullWidth
                    />
                    <BaseColorPicker name="color" label="Color" required />
                  </Stack>
                </BaseDialogContent>
                <DialogActions>
                  <Button onClick={onClose}>Cancel</Button>
                  <SubmitButton>Save</SubmitButton>
                </DialogActions>
              </BaseModalForm>
            );
          }}
        </Formik>
      </BaseDialog>
    );
  }
);

export default RoomUserFormModal;
