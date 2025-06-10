import React from 'react';
import {
  FiHome,
  FiBarChart2,
  FiUsers,
  FiDollarSign,
  FiCreditCard,
  FiTrendingUp,
  FiFileText,
  FiArchive,
  FiSettings,
  FiGlobe,
  FiLink2,
  FiList,
  FiBookOpen,
  FiPieChart,
  FiUserCheck
} from "react-icons/fi";

export const FinanceiroNav = {
  title: "FINANCEIRO",
  sections: [
    {
      title: "VISÃO GERAL",
      items: [
        {
          id: "dashboard",
          icon: <FiHome />,
          label: "Dashboard",
          path: "/financeiro/dashboard"
        },
        {
          id: "inteligencia",
          icon: <FiPieChart />,
          label: "Inteligência",
          path: "/financeiro/inteligencia"
        },
        {
          id: "ranking-clientes",
          icon: <FiBarChart2 />,
          label: "Ranking dos Clientes",
          path: "/financeiro/ranking-clientes"
        },
        {
          id: "saldo-cliente",
          icon: <FiDollarSign />,
          label: "Saldo do Cliente",
          path: "/financeiro/saldo-cliente"
        }
      ]
    },
    {
      title: "MOVIMENTAÇÕES",
      items: [
        {
          id: "comissoes",
          icon: <FiUsers />,
          label: "Comissões em Aberto",
          path: "/financeiro/comissoes"
        },
        {
          id: "lancamentos",
          icon: <FiList />,
          label: "Lançamentos",
          path: "/financeiro/lancamentos"
        },
        {
          id: "conciliacao-cartoes",
          icon: <FiCreditCard />,
          label: "Conciliação de Cartões",
          path: "/financeiro/conciliacao-cartoes"
        },
        {
          id: "contas-pagar",
          icon: <FiTrendingUp />,
          label: "Contas a Pagar",
          path: "/financeiro/contas-pagar"
        },
        {
          id: "demonstrativo",
          icon: <FiFileText />,
          label: "Demonstrativo",
          path: "/financeiro/demonstrativo"
        },
        {
          id: "fluxo-caixa",
          icon: <FiTrendingUp />,
          label: "Fluxo de Caixa",
          path: "/financeiro/fluxo-caixa"
        }
      ]
    },
    {
      title: "GESTÃO",
      items: [
        {
          id: "contas-cartoes",
          icon: <FiCreditCard />,
          label: "Contas e Cartões",
          path: "/financeiro/contas-cartoes"
        },
        {
          id: "categorias-fornecedores",
          icon: <FiArchive />,
          label: "Categorias e Fornecedores",
          path: "/financeiro/categorias-fornecedores"
        },
        {
          id: "formas-pagamento",
          icon: <FiDollarSign />,
          label: "Formas de Pagamento",
          path: "/financeiro/formas-pagamento"
        }
      ]
    },
    {
      title: "CONFIGURAÇÕES",
      items: [
        {
          id: "usuarios-empresa",
          icon: <FiUserCheck />,
          label: "Usuários e Empresa",
          path: "/financeiro/usuarios-empresa"
        },
        {
          id: "fiscal",
          icon: <FiFileText />,
          label: "Fiscal (NF, Perfil Tributário)",
          path: "/financeiro/fiscal"
        }
      ]
    },
    {
      title: "SITE E INTEGRAÇÕES",
      items: [
        {
          id: "site-layout",
          icon: <FiGlobe />,
          label: "Layout do Site",
          path: "/financeiro/site-layout"
        },
        {
          id: "area-cliente",
          icon: <FiUserCheck />,
          label: "Área do Cliente / Boleto",
          path: "/financeiro/area-cliente"
        },
        {
          id: "integracoes",
          icon: <FiLink2 />,
          label: "Integrações (ASSAS/Nubank)",
          path: "/financeiro/integracoes"
        }
      ]
    },
    {
      title: "RELATÓRIOS",
      items: [
        {
          id: "relatorio-pdf",
          icon: <FiFileText />,
          label: "Relatório PDF Mensal",
          path: "/financeiro/relatorio-pdf"
        }
      ]
    }
  ]
}; 