import { getLoyaltyProgramAction, getLoyaltyHistoryAction } from '@/actions/loyalty';
import { getMeAction } from '@/actions/auth';
import LoyaltyDashboard from '@/components/loyalty/LoyaltyDashboard';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'My Loyalty & Rewards | Ecommerce',
  description: 'Track your points and redeem rewards',
};

export default async function LoyaltyPage() {
  const [user, program, history] = await Promise.all([
    getMeAction(),
    getLoyaltyProgramAction(),
    getLoyaltyHistoryAction()
  ]);

  if (!user) {
    redirect('/auth/login?redirect=/account/loyalty');
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Rewards</h1>
        <p className="text-gray-500">Earn points for every purchase and redeem exclusive rewards.</p>
      </div>
      
      <LoyaltyDashboard 
        user={user} 
        program={program} 
        history={history} 
      />
    </div>
  );
}
