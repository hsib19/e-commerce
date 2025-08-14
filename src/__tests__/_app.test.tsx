import { render, screen } from "@testing-library/react";
import App from "../pages/_app"; // sesuaikan path kalau _app.tsx

// Mock komponen halaman
const MockComponent = () => <div>Mock Component</div>;

// Mock router sederhana (bisa dikembangkan jika perlu)
const mockRouter = {
    basePath: '',
    pathname: '/',
    route: '/',
    query: {},
    asPath: '/',
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn().mockResolvedValue(undefined),
    beforePopState: jest.fn(),
    events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
    },
    isFallback: false,
    isReady: true,
    isPreview: false,
    isLocaleDomain: false,
    locale: undefined,
    locales: [],
    defaultLocale: undefined,
};

describe("App component", () => {
    it("renders without crashing", () => {
        render(
            <App
                Component={MockComponent}
                pageProps={{}}
                router={mockRouter as any} 
            />
        );

        expect(screen.getByText("Mock Component")).toBeInTheDocument();
    });
});
