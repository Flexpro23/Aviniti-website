import ReportContent from '../../../components/ReportContent';

export default function ReportPage({ params }: { params: { userId: string } }) {
  return <ReportContent userId={params.userId} />;
} 