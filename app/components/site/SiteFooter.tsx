import Image from "next/image";
import Link from "next/link";
import { footerColumns, notABankDisclosure } from "./config";

export default function SiteFooter() {
  return (
    <footer className="border-t border-hairline bg-paper-elev">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Image
              src="/brand/payve-logo-transparent.png"
              alt="Payve"
              width={109}
              height={50}
              className="h-8 w-auto"
            />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-3">
              Payments, early pay, and agents for supply chain trade.
            </p>
          </div>
          {footerColumns.map((col) => (
            <div key={col.heading}>
              <span className="t-eyebrow block pb-3">{col.heading}</span>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-2 transition-colors hover:text-ink-1"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-hairline pt-6">
          <p className="max-w-3xl text-xs leading-relaxed text-ink-3">
            {notABankDisclosure}
          </p>
          <div className="mt-4">
            <p className="text-xs text-ink-3">
              © {new Date().getFullYear()} Payve, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
