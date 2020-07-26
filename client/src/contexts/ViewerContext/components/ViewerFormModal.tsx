import React, { useMemo, useCallback } from 'react';
import { DialogActions } from '@material-ui/core';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { trimString } from 'utils';
import BaseTextField from 'components/BaseTextField';
import BaseModalForm from 'components/BaseModalForm';
import useSocketIo from 'contexts/SocketIoContext';
import Stack from 'components/Stack';
import BaseColorPicker from 'components/BaseColorPicker';
import BaseDialog from 'components/BaseDialog';
import BaseDialogTitle from 'components/BaseDialog/components/BaseDialogTitle';
import BaseDialogContent from 'components/BaseDialog/components/BaseDialogContent';
import SubmitButton from 'components/SubmitButton';
import BaseButton from 'components/BaseButton';
import { useViewer } from '..';
import { OnSubmitFn } from 'types';

interface ViewerFormValues {
  username: string;
  color: string;
}

const validationSchema = Yup.object().shape<ViewerFormValues>({
  username: Yup.string().label('Username').required().transform(trimString),
  color: Yup.string().label('Color').required(),
});

const ViewerFormModal = React.memo(function ViewerFormModal() {
  const { viewer, isEditing, finishEditing } = useViewer();

  const initialValues = useMemo<ViewerFormValues>(
    () => ({
      username: viewer?.username || '',
      color: viewer?.color || '#000',
    }),
    [viewer]
  );

  const io = useSocketIo();

  const handleSubmit = useCallback<OnSubmitFn<ViewerFormValues>>(
    (values, formikHelpers) => {
      if (!viewer) {
        return;
      }
      io?.emit('edit user', values, () => {
        formikHelpers.setSubmitting(false);
        finishEditing();
      });
    },
    [finishEditing, io, viewer]
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
