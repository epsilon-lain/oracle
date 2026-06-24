type InlineErrorProps = {
  message?: string;
};

export function InlineError({ message }: InlineErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <p className="text-sm leading-6 text-signal" role="alert">
      {message}
    </p>
  );
}
