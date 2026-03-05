/**
 * MessagesView
 * @author Norton 2022
 */

export class MessagesController {
  constructor() {}

  displayError({ error, message }) {
    const errorMessage = message || error?.message || error || 'An unexpected error occurred';
    
    switch (error) {
      case "Session expired":
        this.swal(error, errorMessage + "<br> <b></b>", "error", 2000, () => {
            api.navigateTo('/home');
        });
        break;

      default:
        Swal.fire({
          icon: 'error',
          title: 'Error',
          html: errorMessage,
          confirmButtonColor: '#3085d6'
        });
        break;
    }
  }

  swal(title, html, icon, timer=0, callback = () => {}) {
    let timerInterval;
    Swal.fire({
      title,
      html,
      timer: timer > 0 ? timer : null,
      icon,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const b = Swal.getHtmlContainer().querySelector("b");
        timerInterval = setInterval(() => {
          b.textContent = Swal.getTimerLeft();
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        callback();
      }
    });
  }
}

const messagesController = new MessagesController();
export { messagesController };