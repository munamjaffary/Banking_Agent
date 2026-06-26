import React from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { useGenericMutation } from "../../api/apiSlice";
import { toast } from "react-toastify";

const DeleteModal = ({
  show,
  onHide,
  endpoint,
  id,
  label,
  onDeleteSuccess,
}) => {
  const [deleteddocument, { isLoading }] = useGenericMutation();

  const handleDelete = async () => {
    try {
      await deleteddocument({
        endpoint: endpoint,
        method: "DELETE",
        params: { object_id: id },
      }).unwrap();
      toast.success(`${label} deleted successfully.`);
      if (onDeleteSuccess) onDeleteSuccess();
      onHide();
    } catch (error) {
      toast.error(error?.data?.detail || "Delete failed");
    }
  };

  return (
    <Modal
      show={show}
      centered
      onHide={onHide}
      className="delete-modal"
      backdrop="static"
    >
      <Modal.Header closeButton={!isLoading}>
        <Modal.Title>Delete Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete this {label.toLowerCase()}?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete} disabled={isLoading}>
          {isLoading ? (
            <Spinner animation="border" size="sm" role="status" />
          ) : (
            "Delete"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;
