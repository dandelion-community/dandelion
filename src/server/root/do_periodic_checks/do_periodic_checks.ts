import executeReminders from 'src/server/collections/aid_request_reminder/executeReminders';

export default function do_periodic_checks(): void {
  setTimeout(() => {
    try {
      doPeriodicChecksImpl();
    } catch (e) {
      console.error(e);
    }
  });
}

function doPeriodicChecksImpl(): void {
  executeReminders();
}
