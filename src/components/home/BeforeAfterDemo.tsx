import { BeforeAfterSlider } from './BeforeAfterSlider';
import { MiniSite } from './MiniSite';
import { exampleDesigns } from './exampleDesigns';

/** Intentionally dated layout for the fictional "Sparkle Clean Co." example. */
function OutdatedSite() {
  return (
    <div
      aria-hidden="true"
      className="[container-type:inline-size] h-full w-full overflow-hidden"
      style={{
        background: '#ffff99',
        color: '#000080',
        fontFamily: "'Times New Roman', Times, serif",
        padding: '1.5cqw',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1.7cqw' }}>
        <tbody>
          <tr>
            <td
              colSpan={2}
              style={{
                background: '#ff00ff',
                color: '#00ff00',
                border: '2px solid #000',
                textAlign: 'center',
                fontSize: '3.6cqw',
                fontWeight: 'bold',
                textDecoration: 'underline',
                padding: '0.6cqw',
              }}
            >
              ~*~ SPARKLE CLEAN CO. ~*~
            </td>
          </tr>
          <tr>
            <td
              style={{
                width: '22%',
                verticalAlign: 'top',
                background: '#00ffff',
                border: '2px solid #000',
                padding: '0.8cqw',
                color: '#0000ff',
                textDecoration: 'underline',
                lineHeight: 1.6,
              }}
            >
              Home
              <br />
              About us
              <br />
              Services
              <br />
              Prices
              <br />
              Contact
              <br />
              Links
            </td>
            <td
              style={{
                border: '2px solid #000',
                padding: '0.8cqw',
                background: '#ffcc66',
                fontSize: '1.3cqw',
                lineHeight: 1.3,
                color: '#800000',
              }}
            >
              <p style={{ fontSize: '2.2cqw', fontWeight: 'bold', color: '#ff0000' }}>
                WELCOME TO OUR WEBSITE!!!
              </p>
              <p style={{ marginTop: '0.6cqw' }}>
                We clean houses and offices. Please call us for more information about our services.
                Click here to see more. This page is best viewed in a big window.
              </p>
              <p style={{ marginTop: '0.6cqw', color: '#008000' }}>
                <u>Click here</u> &gt;&gt; <u>Click here</u> &gt;&gt; <u>Click here</u>
              </p>
              <p style={{ marginTop: '0.6cqw', fontSize: '1.1cqw', color: '#666' }}>
                Under construction
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function BeforeAfterDemo() {
  const sparkle = exampleDesigns.find((d) => d.id === 'sparkle-clean')!;
  return (
    <BeforeAfterSlider
      before={<OutdatedSite />}
      after={<MiniSite design={sparkle} />}
      labelBefore="Before"
      labelAfter="After"
    />
  );
}
