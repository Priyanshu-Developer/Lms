import {Box} from "@mui/material";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return(
      <Box width="100vw" height="100vh" display="flex" justifyContent="center" alignItems="center">
        {children}
      </Box>
  );
}