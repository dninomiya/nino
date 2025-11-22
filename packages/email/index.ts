import { render } from "@react-email/components";
import nodemailer from "nodemailer";
import { Resend } from "resend";

const DEFAULT_FROM = "noreply@resend.dev";

type SendEmailProps = {
  from?: string;
  to: string;
  subject: string;
  react?: React.ReactNode;
  text: string;
};

const resend = new Resend(process.env.RESEND_API_KEY);

const sendResendEmail = async (props: SendEmailProps) => {
  const response = await resend.emails.send({
    ...props,
    from: props.from ?? DEFAULT_FROM,
  });
  return response;
};

const transporter = nodemailer.createTransport({
  host: "localhost",
  port: 1025,
  secure: false,
});

const sendMailpitEmail = async ({ react, ...props }: SendEmailProps) => {
  const info = await transporter.sendMail({
    ...props,
    html: react ? await render(react) : undefined,
    from: props.from ?? DEFAULT_FROM,
  });
  return info;
};

export const sendEmail = async (props: SendEmailProps) => {
  if (process.env.NODE_ENV === "production") {
    return sendResendEmail(props);
  }
  return sendMailpitEmail(props);
};
