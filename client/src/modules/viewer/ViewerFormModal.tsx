import React, { useMemo, useCallback } from 'react';
import { DialogActions } from '@material-ui/core';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { removeSpaceAround } from 'modules/shared/SharedUtils';
import BaseTextField from 'modules/shared/BaseTextField';
import BaseModalForm from 'modules/shared/BaseModalForm';
import useSocketIo from 'modules/socket-io/SocketIoContext';
import Stack from 'modules/shared/Stack';
import BaseColorPicker from 'modules/viewer/BaseColorPicker';
import BaseDialog from 'modules/base-dialog/BaseDialog';
import BaseDialogTitle from 'modules/base-dialog/BaseDialogTitle';
import BaseDialogContent from 'modules/base-dialog/BaseDialogContent';
import SubmitButton from 'modules/shared/SubmitButton';
import BaseButton from 'modules/shared/BaseButton';
import { OnSubmitFn } from 'modules/shared/SharedTypes';
import { useViewer } from './ViewerContext';

const validationSchema = Yup.object({
  username: Yup.string()
    .label('Username')
    .required()
    .transform(removeSpaceAround),
  color: Yup.string().label('Color').required(),
});

type ViewerFormValues = Yup.TypeOf<typeof validationSchema>;

const ViewerFormModal = React.memo(function ViewerFormModal() {
  const { viewer, isEditing, finishEditing } = useViewer();

  const initialValues = useMemo<ViewerFormValues>(
    () => ({
      username: viewer?.username || '',
      color: viewer?.color || '#000',
    }),
    [viewer],
  );

  const socket = useSocketIo();

  const handleSubmit = useCallback<OnSubmitFn<ViewerFormValues>>(
    (values, formikHelpers) => {
      if (!viewer) {
        return;
      }
      socket?.emit('edit user', values, () => {
        formikHelpers.setSubmitting(false);
        finishEditing();
      });
    },
    [finishEditing, socket, viewer],
  );

  return (
    <BaseDialog open={isEditing} onClose={finishEditing} fullWidth responsive>
      <BaseDialogTitle>Profile</BaseDialogTitle>
      <Formik<ViewerFormValues>
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnMount
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => {
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
                <BaseButton onClick={finishEditing}>Cancel</BaseButton>
                <SubmitButton loading={isSubmitting}>Save</SubmitButton>
              </DialogActions>
            </BaseModalForm>
          );
        }}
      </Formik>
    </BaseDialog>
  );
});

export default ViewerFormModal;
