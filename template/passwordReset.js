// templates/resetPasswordTemplate.js

const resetPasswordTemplate = (resetURL) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />

      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: Arial, sans-serif;
        }

        body {
          background: #fff7f8;
          padding: 40px 15px;
        }

        .mail-wrapper {
          max-width: 620px;
          margin: auto;
          background: white;
          border: 1px solid #f3c6cf;
          border-radius: 16px;
          overflow: hidden;
        }

        .mail-header {
          padding: 22px;
          background: #fff1f4;
          border-bottom: 1px solid #f3c6cf;
        }

        .mail-header h1 {
          color: #e85d75;
        }

        .mail-content {
          padding: 30px;
          line-height: 1.8;
          color: #444;
        }

        .reset-box {
          margin: 25px 0;
          padding: 25px;
          background: #fff1f4;
          border: 1px solid #f3c6cf;
          border-radius: 12px;
          text-align: center;
        }

        .reset-btn {
          display: inline-block;
          padding: 12px 24px;
          background: #e85d75;
          color: white !important;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
        }

        .link-box {
          margin-top: 18px;
          padding: 12px;
          background: white;
          border-radius: 8px;
          word-break: break-word;
          font-size: 13px;
        }

        .mail-footer {
          padding: 20px 30px;
          background: #fff1f4;
          border-top: 1px solid #f3c6cf;
          font-size: 13px;
          color: #666;
        }
      </style>
    </head>

    <body>

      <div class="mail-wrapper">

        <div class="mail-header">
          <h1>Password Reset</h1>
        </div>

        <div class="mail-content">

          <p>
            You requested a password reset for your account.
          </p>

          <div class="reset-box">

            <a href="${resetURL}" class="reset-btn">
              Reset Password
            </a>

            <div class="link-box">
              ${resetURL}
            </div>

          </div>

          <p>
            If you did not request this, please ignore this email.
          </p>

        </div>

        <div class="mail-footer">
          This link may expire for security reasons.
        </div>

      </div>

    </body>
    </html>
  `;
};

export default resetPasswordTemplate;