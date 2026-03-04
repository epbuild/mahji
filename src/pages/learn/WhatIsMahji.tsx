import { C } from '../../constants/colors';
import { PT, Cnt } from '../../components/Layout';

export default function WhatIsMahji({ onBack, onNavigate }: { onBack: () => void; onNavigate: (lesson: string) => void }) {
  return (
    <>
      <div style={{ padding: '6px 22px 0', display: 'flex', alignItems: 'center' }}>
        <div onClick={onBack} style={{ fontSize: 12, color: C.lavDeep, cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 3 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.lavDeep} strokeWidth="1.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          Learn
        </div>
      </div>
      <PT>What is Mahji?</PT>
      <Cnt>
        <p className="body-text" style={{ color: C.mid, marginBottom: 16, lineHeight: 1.65 }}>
          Mahji is your place to master American Mahjong — anytime, anywhere. Whether you're learning the game for the first time or finally leveling up after years of casual play, Mahji is designed to meet you exactly where you are.
        </p>
        <p className="body-text" style={{ color: C.mid, marginBottom: 16, lineHeight: 1.65 }}>
          Practice your strategy and sharpen your instincts without needing to wait for your next game night. And play a real round whenever the mood strikes, even if you've only got a few minutes to spare.
        </p>
        <p className="body-text" style={{ color: C.mid, marginBottom: 24, lineHeight: 1.65, fontStyle: 'italic' }}>
          Mahj at your own pace — no rushing, no fuss. The game comes to you.
        </p>

        {/* Next lesson button */}
        <div
          onClick={() => onNavigate("What is American Mahjong?")}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '14px 24px', borderRadius: 14,
            background: C.cherry, color: '#fff', cursor: 'pointer',
            fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600,
            marginBottom: 20,
            transition: 'all 0.25s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(224,48,80,0.25)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
        >
          What is American Mahjong?
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </Cnt>
    </>
  );
}
