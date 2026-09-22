(function () {
  var form = document.getElementById("contact-form");
  var confirmEl = document.getElementById("contact-confirm");
  if (!form) return;

  function setError(id, message) {
    var el = document.getElementById(id + "-error");
    if (el) el.textContent = message || "";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = document.getElementById("name").value.trim();
    var email = document.getElementById("email").value.trim();
    var message = document.getElementById("message").value.trim();
    var valid = true;

    setError("name", "");
    setError("email", "");
    setError("message", "");

    if (!name) {
      setError("name", "Let us know who this is from.");
      valid = false;
    }
    if (!email || email.indexOf("@") === -1 || email.indexOf(".") === -1) {
      setError("email", "Enter a valid email address.");
      valid = false;
    }
    if (!message || message.length < 10) {
      setError("message", "Add a few more details (10+ characters).");
      valid = false;
    }
    if (!valid) return;

    form.hidden = true;
    confirmEl.hidden = false;
    confirmEl.focus();
  });

  document.getElementById("reset-form").addEventListener("click", function () {
    form.reset();
    form.hidden = false;
    confirmEl.hidden = true;
  });
})();
