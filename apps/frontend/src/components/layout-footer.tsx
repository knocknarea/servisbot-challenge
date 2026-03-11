import {
  Footer,
  FooterCopyright,
  FooterLink,
  FooterLinkGroup,
} from "flowbite-react";

export default function LayoutFooter() {
  return (
    <Footer container className="bg-mauve-200">
      <FooterCopyright href="#" by="Adrian" year={2026} />
      <FooterLinkGroup>
        <FooterLink href="#">About</FooterLink>
        <FooterLink href="#">Privacy Policy</FooterLink>
      </FooterLinkGroup>
    </Footer>
  );
}
