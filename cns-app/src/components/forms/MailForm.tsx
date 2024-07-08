"use client";

const MailForm = () => {
  function onSubmit() {
    console.log("ello Govna!");
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col p-12 gap-4">
      <input type="text" placeholder="Name" className="border" />
      <input type="email" placeholder="Email" className="border" />
      <textarea placeholder="Message" className="border"></textarea>
      <button type="submit" className="btn">
        Submit
      </button>
    </form>
  );
};

export default MailForm;
