import { Banner } from '@primer/react';
import DefaultLayout from 'interface/DefaultLayout';

export default function ConfirmRegisterPage() {
  return (
    <DefaultLayout
      contentWidth="small"
      metadata={{
        title: 'Confirme seu email',
        description: 'Página de confirmação de cadastro do FinTab',
      }}
    >
      <Banner
        variant="warning"
        title="Falta só uma etapa!"
        description="Abra o email enviado pelo FinTab e clique no link de confirmação."
      />
    </DefaultLayout>
  );
}
