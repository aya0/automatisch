import * as React from 'react';
import { useMutation } from '@apollo/client';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSnackbar } from 'notistack';

import Can from 'components/Can';
import ConfirmationDialog from 'components/ConfirmationDialog';
import { DELETE_ROLE } from 'graphql/mutations/delete-role.ee';
import useFormatMessage from 'hooks/useFormatMessage';

type DeleteRoleButtonProps = {
  disabled?: boolean;
  roleId: string;
};

export default function DeleteRoleButton(props: DeleteRoleButtonProps) {
  const { disabled, roleId } = props;
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [deleteRole] = useMutation(DELETE_ROLE, {
    variables: { input: { id: roleId } },
    refetchQueries: ['GetRoles'],
  });
  const formatMessage = useFormatMessage();
  const { enqueueSnackbar } = useSnackbar();

  const handleConfirm = React.useCallback(async () => {
    try {
      await deleteRole();

      setShowConfirmation(false);
      enqueueSnackbar(formatMessage('deleteRoleButton.successfullyDeleted'), {
        variant: 'success',
      });
    } catch (error) {
      throw new Error('Failed while deleting!');
    }
  }, [deleteRole]);

  return (
    <>
      <Can I="delete" a="Role" passThrough>
        {(allowed) => (
          <IconButton
            disabled={!allowed || disabled}
            onClick={() => setShowConfirmation(true)}
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        )}
      </Can>

      <ConfirmationDialog
        open={showConfirmation}
        title={formatMessage('deleteRoleButton.title')}
        description={formatMessage('deleteRoleButton.description')}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirm}
        cancelButtonChildren={formatMessage('deleteRoleButton.cancel')}
        confirmButtionChildren={formatMessage('deleteRoleButton.confirm')}
      />
    </>
  );
}
