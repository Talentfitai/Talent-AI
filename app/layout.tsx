import { ReactNode } from "react";

export const metadata = {
  title: "TalentFit AI - HR Assessment Platform",
  description: "Platform evaluasi kandidat dengan DISC, MBTI, dan IQ Test",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
