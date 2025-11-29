import ReportContent from '../../../components/ReportContent';

export default async function ReportPage(props: { params: Promise<{ userId: string }> }) {
  const params = await props.params;
  return <ReportContent userId={params.userId} />;
} 