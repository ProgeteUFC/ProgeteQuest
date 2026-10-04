import { Outlet } from "react-router-dom";
import styled from "styled-components";
import HeaderAdmin from "../HeaderAdmin";
import Footer from "../Footer";

const Layout = styled.div`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.kingfisherDaisy};
  color: white;
  font-family: "Baloo Paaji 2", sans-serif;
  & > main { flex: 1; min-height: 0; background: transparent; }
`;

export default function AdminLayout() {
  return <Layout><HeaderAdmin /><main><Outlet /></main><Footer /></Layout>;
}
