import type { ReactNode } from "react";

type PropsWithChildren<P = unknown> = P & { children: ReactNode };

const Layout = (props: PropsWithChildren) => {
    const { children } = props;
    return (
        <>
            <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center sm:p-4">
                <div className="w-full max-w-md bg-white min-h-screen sm:min-h-0 sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-between">
                    {children}
                </div>
            </div>
        </>
    )
}

export default Layout