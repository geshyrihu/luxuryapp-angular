import Swal from 'sweetalert2';

export async function confirmAction(message: string): Promise<boolean> {
  const result = await Swal.fire({
    title: 'Confirmación',
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar',
    customClass: { container: 'my-swal-container' },
    focusCancel: true
  });

  return result.isConfirmed;
}
