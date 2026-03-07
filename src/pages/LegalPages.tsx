import { C, getThemeColors, FONT_SERIF, FONT_SANS } from '../constants/colors';
import { useTheme } from '../constants/ThemeContext';
import { Cnt, PT } from '../components/Layout';

/* ── SHARED LEGAL COMPONENTS ── */

const BackLink = ({ label, onClick, t }: { label: string; onClick: () => void; t: ReturnType<typeof getThemeColors> }) => (
  <div style={{ padding: '6px 22px 0', display: 'flex', alignItems: 'center' }}>
    <div onClick={onClick} style={{ fontSize: 12, color: t.lavDeep, cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 3 }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.lavDeep} strokeWidth="1.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
      {label}
    </div>
  </div>
);

const SectionHead = ({ children, t }: { children: React.ReactNode; t: ReturnType<typeof getThemeColors> }) => (
  <h2 style={{
    fontFamily: FONT_SERIF,
    fontSize: 14,
    fontWeight: 700,
    color: C.cherry,
    margin: '24px 0 8px',
    letterSpacing: 0.3,
  }}>{children}</h2>
);

const P = ({ children, t }: { children: React.ReactNode; t: ReturnType<typeof getThemeColors> }) => (
  <p style={{
    fontFamily: FONT_SANS,
    fontSize: 12,
    color: t.textMain,
    lineHeight: 1.7,
    margin: '0 0 10px',
  }}>{children}</p>
);

const SubHead = ({ children, t }: { children: React.ReactNode; t: ReturnType<typeof getThemeColors> }) => (
  <h3 style={{
    fontFamily: FONT_SERIF,
    fontSize: 12,
    fontWeight: 600,
    color: t.textMain,
    margin: '16px 0 6px',
    letterSpacing: 0.2,
  }}>{children}</h3>
);

const LastUpdated = ({ t }: { t: ReturnType<typeof getThemeColors> }) => (
  <div style={{
    fontFamily: FONT_SANS,
    fontSize: 11,
    color: t.textMid,
    marginBottom: 16,
    fontStyle: 'italic',
  }}>Last Updated: March 7, 2026</div>
);


/* ════════════════════════════════════════════════════════════════════════════
   TERMS OF USE
   ════════════════════════════════════════════════════════════════════════════ */

export function TermsOfUse({ onBack }: { onBack: () => void }) {
  const { isDark } = useTheme();
  const t = getThemeColors(isDark);

  return (
    <>
      <BackLink label="Back" onClick={onBack} t={t} />
      <PT>Terms of Use</PT>
      <Cnt>
        <LastUpdated t={t} />

        <P t={t}>
          Welcome to Mahji. These Terms of Use ("Terms") constitute a legally binding agreement between you ("you" or "User") and Mahji LLC, a Delaware limited liability company ("Mahji," "we," "us," or "our"), governing your access to and use of the Mahji mobile application, website, and all related services (collectively, the "Service"). Please read these Terms carefully before using the Service. By accessing or using the Service, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy, which is incorporated herein by reference. If you do not agree to these Terms, you must not access or use the Service.
        </P>

        {/* 1 */}
        <SectionHead t={t}>1. Acceptance of Terms</SectionHead>
        <P t={t}>
          1.1. By creating an account, accessing, or using the Service in any manner, you affirm that you have read and agree to be bound by these Terms. If you are using the Service on behalf of an organization, you represent and warrant that you have the authority to bind such organization to these Terms.
        </P>
        <P t={t}>
          1.2. We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated Terms within the Service and updating the "Last Updated" date above. Your continued use of the Service after such modifications constitutes your acceptance of the revised Terms. If you do not agree to the modified Terms, your sole remedy is to discontinue use of the Service.
        </P>
        <P t={t}>
          1.3. Certain features of the Service may be subject to additional terms and conditions, which are incorporated into these Terms by reference. In the event of a conflict between these Terms and any additional terms, the additional terms shall control with respect to the applicable feature.
        </P>

        {/* 2 */}
        <SectionHead t={t}>2. Eligibility</SectionHead>
        <P t={t}>
          2.1. The Service is intended for users who are at least thirteen (13) years of age. By using the Service, you represent and warrant that you are at least 13 years old. If you are under 18 years of age, you represent that your parent or legal guardian has reviewed and agreed to these Terms on your behalf.
        </P>
        <P t={t}>
          2.2. If you are under the age of 13, you are not permitted to use the Service. If we become aware that a user is under 13, we will promptly terminate their account and delete any associated personal information in accordance with the Children's Online Privacy Protection Act ("COPPA") and our Privacy Policy.
        </P>
        <P t={t}>
          2.3. By using the Service, you further represent and warrant that you are not barred from using the Service under any applicable law, and that you are not located in a country subject to a U.S. government embargo or designated as a "terrorist supporting" country.
        </P>

        {/* 3 */}
        <SectionHead t={t}>3. Account Registration</SectionHead>
        <P t={t}>
          3.1. To access certain features of the Service, you may be required to create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
        </P>
        <P t={t}>
          3.2. You are responsible for safeguarding the password or authentication credentials associated with your account. You agree not to disclose your password to any third party and to notify us immediately of any unauthorized use of your account. You are solely responsible for all activities that occur under your account, whether or not you have authorized such activities.
        </P>
        <P t={t}>
          3.3. We reserve the right to disable any account at any time, including if, in our sole discretion, we believe you have violated any provision of these Terms.
        </P>
        <P t={t}>
          3.4. You may not create more than one account per person. You may not create an account using a false identity or information, or on behalf of someone other than yourself. You may not transfer or assign your account to any other person or entity.
        </P>

        {/* 4 */}
        <SectionHead t={t}>4. License to Use the Service</SectionHead>
        <P t={t}>
          4.1. Subject to your compliance with these Terms, Mahji grants you a limited, non-exclusive, non-transferable, non-sublicensable, revocable license to access and use the Service for your personal, non-commercial purposes. This license does not include any right to: (a) modify or make derivative works of the Service or any content therein; (b) use any data mining, robots, scraping, or similar data-gathering or extraction methods; (c) download (other than page caching) any portion of the Service except as expressly permitted; or (d) use the Service or any content therein for any commercial purpose.
        </P>
        <P t={t}>
          4.2. This license is effective until terminated. We may terminate this license at any time for any reason without notice. Upon termination, you must cease all use of the Service and destroy all copies of any content obtained from the Service.
        </P>
        <P t={t}>
          4.3. Except as expressly stated herein, nothing in these Terms shall be construed as conferring any license to intellectual property rights, whether by estoppel, implication, or otherwise.
        </P>

        {/* 5 */}
        <SectionHead t={t}>5. User Conduct</SectionHead>
        <P t={t}>
          5.1. You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:
        </P>
        <P t={t}>
          (a) Use the Service in any manner that could disable, overburden, damage, or impair the Service, or interfere with any other party's use of the Service;
        </P>
        <P t={t}>
          (b) Use any robot, spider, scraper, or other automated means to access the Service for any purpose without our express written permission;
        </P>
        <P t={t}>
          (c) Attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the Service, the server on which the Service is stored, or any server, computer, or database connected to the Service;
        </P>
        <P t={t}>
          (d) Use cheats, exploits, automation software, bots, hacks, mods, or any unauthorized third-party software designed to modify or interfere with the Service or any game experience;
        </P>
        <P t={t}>
          (e) Harass, abuse, threaten, or intimidate other users of the Service, or engage in any conduct that is hateful, discriminatory, obscene, or otherwise objectionable;
        </P>
        <P t={t}>
          (f) Impersonate or attempt to impersonate Mahji, a Mahji employee, another user, or any other person or entity;
        </P>
        <P t={t}>
          (g) Use the Service to transmit, or procure the sending of, any advertising or promotional material, including any "junk mail," "chain letter," "spam," or similar solicitation;
        </P>
        <P t={t}>
          (h) Engage in any form of collusion, match-fixing, or other manipulation of game outcomes;
        </P>
        <P t={t}>
          (i) Reverse engineer, decompile, disassemble, or otherwise attempt to derive the source code of the Service or any part thereof.
        </P>
        <P t={t}>
          5.2. We reserve the right, but are not obligated, to monitor user activity and to take appropriate action against any user who violates these Terms, including removing content, suspending or terminating accounts, and reporting violations to law enforcement authorities.
        </P>

        {/* 6 */}
        <SectionHead t={t}>6. Intellectual Property</SectionHead>
        <P t={t}>
          6.1. The Service and all of its contents, features, and functionality -- including but not limited to all information, software, source code, text, displays, images, video, audio, tile artwork, sound effects, voice recordings, game designs, card data, scoring algorithms, and the design, selection, and arrangement thereof -- are owned by Mahji, its licensors, or other providers of such material and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
        </P>
        <P t={t}>
          6.2. The Mahji name, the Mahji logo, the tile icon, and all related names, logos, product and service names, designs, and slogans are trademarks of Mahji or its affiliates. You may not use such marks without our prior written permission. All other names, logos, product and service names, designs, and slogans on the Service are the trademarks of their respective owners.
        </P>
        <P t={t}>
          6.3. You acknowledge that the custom tile artwork, bamboo bird illustrations, dragon designs, SVG art, sound effects generated through Web Audio API synthesis, and voice recordings within the Service are original creative works of Mahji and are protected by copyright. No portion of such works may be reproduced, distributed, modified, or used in any manner without our express written consent.
        </P>

        {/* 7 */}
        <SectionHead t={t}>7. User Content</SectionHead>
        <P t={t}>
          7.1. The Service may allow you to submit, post, or transmit content, including but not limited to profile information, screen names, game chat messages, and feedback ("User Content"). You retain ownership of your User Content; however, by submitting User Content to the Service, you grant Mahji a worldwide, non-exclusive, royalty-free, sublicensable, and transferable license to use, reproduce, distribute, prepare derivative works of, display, and perform such User Content in connection with the Service and Mahji's business operations.
        </P>
        <P t={t}>
          7.2. You represent and warrant that: (a) you own or control all rights in and to the User Content; (b) the User Content does not violate the rights of any third party; and (c) the User Content complies with these Terms and all applicable laws.
        </P>

        {/* 8 */}
        <SectionHead t={t}>8. Virtual Items and In-App Purchases</SectionHead>
        <P t={t}>
          8.1. The Service may offer virtual items, virtual currency (including "Mahji Cash"), premium features, card subscriptions, or other in-app purchases ("Virtual Items"). Virtual Items are licensed to you on a limited, personal, non-transferable, non-sublicensable, revocable basis and have no real-world monetary value. Virtual Items cannot be redeemed for cash or transferred outside the Service except as expressly provided.
        </P>
        <P t={t}>
          8.2. All purchases of Virtual Items are final and non-refundable, except as required by applicable law. We reserve the right to modify, manage, regulate, control, or eliminate Virtual Items at any time, with or without notice. We shall have no liability to you or any third party in the event that we exercise any such rights.
        </P>
        <P t={t}>
          8.3. Pricing for Virtual Items is subject to change without notice. You are responsible for any applicable taxes related to your purchases.
        </P>
        <P t={t}>
          8.4. If you are a minor, you may not make any in-app purchases without the consent of your parent or legal guardian.
        </P>

        {/* 9 */}
        <SectionHead t={t}>9. Third-Party Services and Content</SectionHead>
        <P t={t}>
          9.1. The Service may contain links to third-party websites, services, or content that are not owned or controlled by Mahji. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You acknowledge and agree that Mahji shall not be responsible or liable for any damage or loss caused or alleged to be caused by or in connection with use of any such content, goods, or services available through any such websites or services.
        </P>
        <P t={t}>
          9.2. The Service may integrate with third-party services, including but not limited to voice synthesis providers (e.g., ElevenLabs), analytics platforms, and authentication providers. Your use of such integrated services is subject to the respective third party's terms of service and privacy policies.
        </P>

        {/* 10 */}
        <SectionHead t={t}>10. Disclaimers</SectionHead>
        <P t={t}>
          10.1. THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, MAHJI DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
        </P>
        <P t={t}>
          10.2. MAHJI DOES NOT WARRANT THAT: (A) THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE; (B) THE RESULTS OBTAINED FROM USE OF THE SERVICE WILL BE ACCURATE OR RELIABLE; (C) THE QUALITY OF ANY PRODUCTS, SERVICES, INFORMATION, OR OTHER MATERIAL OBTAINED THROUGH THE SERVICE WILL MEET YOUR EXPECTATIONS; OR (D) ANY ERRORS IN THE SERVICE WILL BE CORRECTED.
        </P>
        <P t={t}>
          10.3. YOU ACKNOWLEDGE THAT MAHJI IS A GAME APPLICATION FOR ENTERTAINMENT AND EDUCATIONAL PURPOSES. MAHJI IS NOT AFFILIATED WITH, ENDORSED BY, OR SPONSORED BY THE NATIONAL MAH JONGG LEAGUE (NMJL). NMJL CARD DATA INCLUDED IN THE SERVICE IS USED FOR EDUCATIONAL AND REFERENCE PURPOSES ONLY.
        </P>

        {/* 11 */}
        <SectionHead t={t}>11. Limitation of Liability</SectionHead>
        <P t={t}>
          11.1. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL MAHJI, ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, SUPPLIERS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES (EVEN IF MAHJI HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES), ARISING OUT OF OR IN CONNECTION WITH: (A) YOUR USE OF OR INABILITY TO USE THE SERVICE; (B) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE; (C) ANY CONTENT OBTAINED FROM THE SERVICE; OR (D) UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT.
        </P>
        <P t={t}>
          11.2. IN NO EVENT SHALL MAHJI'S TOTAL AGGREGATE LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICE EXCEED THE GREATER OF: (A) THE AMOUNTS YOU HAVE PAID TO MAHJI IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM; OR (B) ONE HUNDRED U.S. DOLLARS ($100.00).
        </P>
        <P t={t}>
          11.3. THE LIMITATIONS OF THIS SECTION SHALL APPLY TO ANY THEORY OF LIABILITY, WHETHER BASED ON WARRANTY, CONTRACT, STATUTE, TORT (INCLUDING NEGLIGENCE), OR OTHERWISE, AND WHETHER OR NOT MAHJI HAS BEEN INFORMED OF THE POSSIBILITY OF ANY SUCH DAMAGE.
        </P>
        <P t={t}>
          11.4. SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES. IF THESE LAWS APPLY TO YOU, SOME OR ALL OF THE ABOVE EXCLUSIONS OR LIMITATIONS MAY NOT APPLY TO YOU, AND YOU MAY HAVE ADDITIONAL RIGHTS.
        </P>

        {/* 12 */}
        <SectionHead t={t}>12. Indemnification</SectionHead>
        <P t={t}>
          12.1. You agree to indemnify, defend, and hold harmless Mahji, its affiliates, officers, directors, employees, agents, licensors, and suppliers from and against any and all claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to: (a) your use of the Service; (b) your violation of these Terms; (c) your violation of any rights of a third party; or (d) your User Content.
        </P>

        {/* 13 */}
        <SectionHead t={t}>13. Termination</SectionHead>
        <P t={t}>
          13.1. We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use the Service will immediately cease.
        </P>
        <P t={t}>
          13.2. Upon termination of your account: (a) all licenses and rights granted to you under these Terms will immediately terminate; (b) you must immediately cease all use of the Service; (c) any Virtual Items associated with your account will be forfeited and no refund will be provided; and (d) we may, but are not obligated to, delete your account information and User Content.
        </P>
        <P t={t}>
          13.3. All provisions of these Terms which by their nature should survive termination shall survive, including without limitation ownership provisions, warranty disclaimers, indemnification, and limitations of liability.
        </P>

        {/* 14 */}
        <SectionHead t={t}>14. Governing Law</SectionHead>
        <P t={t}>
          14.1. These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions. You agree to submit to the personal and exclusive jurisdiction of the courts located within the State of Delaware for any disputes not subject to the arbitration provisions below.
        </P>

        {/* 15 */}
        <SectionHead t={t}>15. Dispute Resolution and Arbitration</SectionHead>
        <P t={t}>
          15.1. <span style={{ fontWeight: 600 }}>Informal Resolution.</span> Before initiating any formal dispute proceeding, you agree to first contact us at legal@mahji.com and attempt to resolve the dispute informally. We will attempt to resolve the dispute by contacting you via email. If the dispute is not resolved within thirty (30) days of submission, either party may proceed as set forth below.
        </P>
        <P t={t}>
          15.2. <span style={{ fontWeight: 600 }}>Binding Arbitration.</span> Any dispute, claim, or controversy arising out of or relating to these Terms or the Service, including the determination of the scope or applicability of this agreement to arbitrate, shall be determined by binding arbitration administered by the American Arbitration Association ("AAA") in accordance with its Consumer Arbitration Rules then in effect. The arbitration shall be conducted by a single arbitrator, and the seat of arbitration shall be Wilmington, Delaware. The arbitrator's decision shall be final and binding and may be entered as a judgment in any court of competent jurisdiction.
        </P>
        <P t={t}>
          15.3. <span style={{ fontWeight: 600 }}>Class Action Waiver.</span> YOU AND MAHJI AGREE THAT EACH PARTY MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS, COLLECTIVE, REPRESENTATIVE, OR CONSOLIDATED ACTION. THE ARBITRATOR MAY NOT CONSOLIDATE MORE THAN ONE PERSON'S CLAIMS AND MAY NOT OTHERWISE PRESIDE OVER ANY FORM OF A CLASS, COLLECTIVE, OR REPRESENTATIVE PROCEEDING. IF THIS SPECIFIC PROVISION IS FOUND TO BE UNENFORCEABLE, THEN THE ENTIRETY OF THIS ARBITRATION SECTION SHALL BE NULL AND VOID.
        </P>
        <P t={t}>
          15.4. <span style={{ fontWeight: 600 }}>Exceptions.</span> Notwithstanding the foregoing, either party may seek injunctive or other equitable relief in any court of competent jurisdiction to prevent the actual or threatened infringement, misappropriation, or violation of a party's copyrights, trademarks, trade secrets, patents, or other intellectual property rights.
        </P>
        <P t={t}>
          15.5. <span style={{ fontWeight: 600 }}>Opt-Out.</span> You may opt out of this arbitration agreement by sending written notice to legal@mahji.com within thirty (30) days of first accepting these Terms. Your notice must include your name, mailing address, and a clear statement that you wish to opt out of this arbitration agreement.
        </P>

        {/* 16 */}
        <SectionHead t={t}>16. General Provisions</SectionHead>
        <P t={t}>
          16.1. <span style={{ fontWeight: 600 }}>Entire Agreement.</span> These Terms, together with the Privacy Policy and any additional terms for specific features, constitute the entire agreement between you and Mahji regarding the Service and supersede all prior and contemporaneous understandings, agreements, representations, and warranties.
        </P>
        <P t={t}>
          16.2. <span style={{ fontWeight: 600 }}>Severability.</span> If any provision of these Terms is held to be invalid, illegal, or unenforceable, such provision shall be modified to the minimum extent necessary to make it valid, legal, and enforceable. If such modification is not possible, the provision shall be severed, and the remaining provisions shall continue in full force and effect.
        </P>
        <P t={t}>
          16.3. <span style={{ fontWeight: 600 }}>Waiver.</span> No waiver by Mahji of any term or condition set forth in these Terms shall be deemed a further or continuing waiver of such term or condition or a waiver of any other term or condition.
        </P>
        <P t={t}>
          16.4. <span style={{ fontWeight: 600 }}>Assignment.</span> You may not assign or transfer these Terms or any rights or obligations hereunder, by operation of law or otherwise, without our prior written consent. Mahji may assign these Terms at any time without restriction. Subject to the foregoing, these Terms will bind and inure to the benefit of the parties and their respective successors and permitted assigns.
        </P>
        <P t={t}>
          16.5. <span style={{ fontWeight: 600 }}>Force Majeure.</span> Mahji shall not be liable for any failure or delay in performance resulting from causes beyond its reasonable control, including but not limited to acts of God, natural disasters, war, terrorism, pandemic, governmental action, or failure of third-party services.
        </P>
        <P t={t}>
          16.6. <span style={{ fontWeight: 600 }}>Notices.</span> We may provide notice to you via the Service, email, or other means. You may provide notice to us by emailing legal@mahji.com.
        </P>

        {/* 17 */}
        <SectionHead t={t}>17. Contact Information</SectionHead>
        <P t={t}>
          If you have any questions about these Terms of Use, please contact us at:
        </P>
        <P t={t}>
          Mahji LLC{'\n'}
          <br />Email: legal@mahji.com
        </P>

        <div style={{ height: 40 }} />
      </Cnt>
    </>
  );
}


/* ════════════════════════════════════════════════════════════════════════════
   PRIVACY POLICY
   ════════════════════════════════════════════════════════════════════════════ */

export function PrivacyPolicy({ onBack }: { onBack: () => void }) {
  const { isDark } = useTheme();
  const t = getThemeColors(isDark);

  return (
    <>
      <BackLink label="Back" onClick={onBack} t={t} />
      <PT>Privacy Policy</PT>
      <Cnt>
        <LastUpdated t={t} />

        <P t={t}>
          This Privacy Policy ("Policy") describes how Mahji LLC, a Delaware limited liability company ("Mahji," "we," "us," or "our"), collects, uses, discloses, and protects information about you when you use the Mahji mobile application, website, and all related services (collectively, the "Service"). By accessing or using the Service, you agree to this Policy. If you do not agree with this Policy, please do not access or use the Service.
        </P>

        {/* 1 */}
        <SectionHead t={t}>1. Information We Collect</SectionHead>
        <P t={t}>
          We collect information in the following ways:
        </P>

        <SubHead t={t}>1.1. Information You Provide Directly</SubHead>
        <P t={t}>
          (a) <span style={{ fontWeight: 600 }}>Account Information.</span> When you create an account, we collect your email address, display name, screen name, and password or authentication credentials (if using email sign-in). If you register using a third-party service (e.g., Apple, Google), we may receive your name and email address from that provider.
        </P>
        <P t={t}>
          (b) <span style={{ fontWeight: 600 }}>Profile Information.</span> You may optionally provide additional information such as your avatar selection, profile photo, city, state, and player ID.
        </P>
        <P t={t}>
          (c) <span style={{ fontWeight: 600 }}>Communications.</span> When you contact us for support, provide feedback, or communicate with other users through the Service, we collect the content of those communications.
        </P>
        <P t={t}>
          (d) <span style={{ fontWeight: 600 }}>Payment Information.</span> If you make in-app purchases, payment processing is handled by third-party payment processors (e.g., Apple App Store, Google Play Store). We do not directly collect or store your credit card numbers or banking information. We may receive transaction confirmations and purchase history from these processors.
        </P>

        <SubHead t={t}>1.2. Information Collected Automatically</SubHead>
        <P t={t}>
          (a) <span style={{ fontWeight: 600 }}>Usage Data.</span> We automatically collect information about your interactions with the Service, including: pages and features accessed; game sessions played, including drill completions, scores, and practice statistics; tiles played and hands matched; in-app navigation patterns and feature usage; time spent in the application and session duration.
        </P>
        <P t={t}>
          (b) <span style={{ fontWeight: 600 }}>Device Information.</span> We collect information about the device you use to access the Service, including: device type, model, and manufacturer; operating system and version; unique device identifiers; screen resolution and display settings; browser type and version (for web access); language and time zone settings.
        </P>
        <P t={t}>
          (c) <span style={{ fontWeight: 600 }}>Log Data.</span> Our servers automatically record information ("Log Data") created by your use of the Service, including: IP address; access dates and times; app crashes and error reports; referring URLs and exit pages.
        </P>
        <P t={t}>
          (d) <span style={{ fontWeight: 600 }}>Local Storage.</span> The Service uses browser local storage and similar technologies to store your preferences (e.g., theme selection, sound settings, voice pack preference) locally on your device. This data is not transmitted to our servers unless necessary for account synchronization.
        </P>

        <SubHead t={t}>1.3. Information from Third Parties</SubHead>
        <P t={t}>
          We may receive information about you from third-party authentication providers (Apple, Google) when you choose to sign in using those services, as well as from analytics providers and advertising partners as described in Section 8.
        </P>

        {/* 2 */}
        <SectionHead t={t}>2. How We Use Your Information</SectionHead>
        <P t={t}>
          We use the information we collect for the following purposes:
        </P>
        <P t={t}>
          (a) <span style={{ fontWeight: 600 }}>Provide and Maintain the Service.</span> To operate the Service, manage your account, authenticate your identity, process transactions, and deliver the features and functionality you request.
        </P>
        <P t={t}>
          (b) <span style={{ fontWeight: 600 }}>Personalize Your Experience.</span> To customize the Service to your preferences, including game settings, theme, sound preferences, voice narrator selection, and practice difficulty.
        </P>
        <P t={t}>
          (c) <span style={{ fontWeight: 600 }}>Improve the Service.</span> To understand how users interact with the Service, identify trends, diagnose technical issues, and develop new features and improvements. This includes analyzing game play patterns, drill completion rates, and feature adoption to improve our educational content and game mechanics.
        </P>
        <P t={t}>
          (d) <span style={{ fontWeight: 600 }}>Communications.</span> To send you service-related notices, including account verification, security alerts, technical notices, and support and administrative messages. With your consent, we may also send promotional communications, which you may opt out of at any time.
        </P>
        <P t={t}>
          (e) <span style={{ fontWeight: 600 }}>Safety and Security.</span> To detect, investigate, and prevent fraudulent transactions, abuse, cheating, and other illegal or unauthorized activities, and to protect the rights and safety of Mahji and our users.
        </P>
        <P t={t}>
          (f) <span style={{ fontWeight: 600 }}>Legal Compliance.</span> To comply with applicable legal obligations, including responding to legal process, enforcing our Terms of Use, and protecting our legal rights.
        </P>
        <P t={t}>
          (g) <span style={{ fontWeight: 600 }}>Referral Programs.</span> To administer referral programs, including tracking referral codes and Mahji Cash earned through friend invitations.
        </P>

        {/* 3 */}
        <SectionHead t={t}>3. How We Share Your Information</SectionHead>
        <P t={t}>
          We do not sell your personal information to third parties. We may share your information in the following limited circumstances:
        </P>
        <P t={t}>
          (a) <span style={{ fontWeight: 600 }}>Service Providers.</span> We share information with third-party service providers who perform services on our behalf, such as hosting, analytics, customer support, payment processing, and email delivery. These providers are contractually obligated to use your information only as necessary to provide their services to us and are prohibited from using it for their own purposes.
        </P>
        <P t={t}>
          (b) <span style={{ fontWeight: 600 }}>Other Users.</span> Certain information in your profile (display name, screen name, avatar, and statistics you choose to make public) may be visible to other users of the Service. You can control your profile visibility through your account settings.
        </P>
        <P t={t}>
          (c) <span style={{ fontWeight: 600 }}>Legal Requirements.</span> We may disclose your information if required to do so by law, or in the good faith belief that such disclosure is reasonably necessary to: (i) comply with a legal obligation, court order, or legal process; (ii) protect and defend the rights or property of Mahji; (iii) prevent or investigate possible wrongdoing in connection with the Service; (iv) protect the personal safety of users or the public; or (v) protect against legal liability.
        </P>
        <P t={t}>
          (d) <span style={{ fontWeight: 600 }}>Business Transfers.</span> In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company, your information may be transferred. We will provide notice before your personal information is transferred and becomes subject to a different privacy policy.
        </P>
        <P t={t}>
          (e) <span style={{ fontWeight: 600 }}>Aggregated or De-Identified Data.</span> We may share aggregated or de-identified information that cannot reasonably be used to identify you for any purpose, including research, analytics, and marketing.
        </P>
        <P t={t}>
          (f) <span style={{ fontWeight: 600 }}>With Your Consent.</span> We may share your information with third parties when you give us explicit consent to do so.
        </P>

        {/* 4 */}
        <SectionHead t={t}>4. Data Security</SectionHead>
        <P t={t}>
          4.1. We implement commercially reasonable technical, administrative, and organizational security measures designed to protect the security and confidentiality of your personal information. These measures include encryption of data in transit using TLS/SSL, secure storage practices, access controls, and regular security assessments.
        </P>
        <P t={t}>
          4.2. However, no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee its absolute security. You acknowledge and accept that any transmission of personal information is at your own risk.
        </P>
        <P t={t}>
          4.3. In the event of a data breach that affects your personal information, we will notify you and the relevant authorities in accordance with applicable law.
        </P>

        {/* 5 */}
        <SectionHead t={t}>5. Children's Privacy</SectionHead>
        <P t={t}>
          5.1. The Service is not directed to children under the age of thirteen (13). We do not knowingly collect personal information from children under 13. If we become aware that we have inadvertently collected personal information from a child under 13, we will take steps to delete such information as promptly as possible.
        </P>
        <P t={t}>
          5.2. In compliance with the Children's Online Privacy Protection Act ("COPPA"), if a parent or guardian becomes aware that their child has provided us with personal information without their consent, they should contact us at legal@mahji.com. We will delete such information from our records within a reasonable time.
        </P>
        <P t={t}>
          5.3. For users between the ages of 13 and 18, we encourage parents and guardians to monitor their children's use of the Service and to help enforce this Policy.
        </P>

        {/* 6 */}
        <SectionHead t={t}>6. Your Rights and Choices</SectionHead>
        <P t={t}>
          6.1. <span style={{ fontWeight: 600 }}>Account Information.</span> You may update, correct, or delete your account information at any time through your profile settings in the Service. If you wish to delete your account entirely, you may do so through the Data & Privacy section in your profile or by contacting us at legal@mahji.com.
        </P>
        <P t={t}>
          6.2. <span style={{ fontWeight: 600 }}>Communications Preferences.</span> You may opt out of receiving promotional emails by following the unsubscribe instructions in those emails. Even if you opt out of promotional communications, we may continue to send you non-promotional, service-related communications.
        </P>
        <P t={t}>
          6.3. <span style={{ fontWeight: 600 }}>Push Notifications.</span> You may opt out of receiving push notifications through your device settings.
        </P>
        <P t={t}>
          6.4. <span style={{ fontWeight: 600 }}>Data Portability.</span> You may request a copy of your personal data in a commonly used, machine-readable format by using the "Download My Data" feature in your profile settings or by contacting us.
        </P>
        <P t={t}>
          6.5. <span style={{ fontWeight: 600 }}>California Residents.</span> If you are a California resident, you have additional rights under the California Consumer Privacy Act ("CCPA"), including the right to: (i) know what personal information we collect, use, disclose, and sell; (ii) request deletion of your personal information; (iii) opt out of the sale of your personal information (note: we do not sell personal information); and (iv) not be discriminated against for exercising your CCPA rights. To exercise these rights, contact us at legal@mahji.com.
        </P>
        <P t={t}>
          6.6. <span style={{ fontWeight: 600 }}>European Economic Area (EEA) Residents.</span> If you are located in the EEA, you have certain rights under the General Data Protection Regulation ("GDPR"), including the rights to access, rectify, erase, restrict processing, and port your personal data, and to object to processing. To exercise these rights, contact us at legal@mahji.com. The legal bases for our processing of your personal data include your consent, the performance of our contract with you, and our legitimate interests in operating and improving the Service.
        </P>

        {/* 7 */}
        <SectionHead t={t}>7. Data Retention</SectionHead>
        <P t={t}>
          7.1. We retain your personal information for as long as your account is active or as needed to provide you with the Service. We may also retain and use your information as necessary to comply with legal obligations, resolve disputes, enforce our agreements, and protect our legal rights.
        </P>
        <P t={t}>
          7.2. When your account is deleted, we will delete or anonymize your personal information within ninety (90) days, except where retention is required by law or for legitimate business purposes (e.g., fraud prevention, financial record-keeping). Certain de-identified or aggregated data may be retained indefinitely for analytics purposes.
        </P>
        <P t={t}>
          7.3. Game statistics and leaderboard data may be retained in anonymized form after account deletion.
        </P>

        {/* 8 */}
        <SectionHead t={t}>8. Third-Party Services</SectionHead>
        <P t={t}>
          The Service may use or integrate with the following categories of third-party services:
        </P>
        <P t={t}>
          (a) <span style={{ fontWeight: 600 }}>Analytics.</span> We use analytics services to help us understand how users interact with the Service. These services may collect information about your use of the Service, including pages visited, features used, and session duration.
        </P>
        <P t={t}>
          (b) <span style={{ fontWeight: 600 }}>Voice Synthesis.</span> The Service may use ElevenLabs or similar voice synthesis services to generate voice narration for game announcements and tile pronunciation. Audio generation requests may include text content but do not include your personal information.
        </P>
        <P t={t}>
          (c) <span style={{ fontWeight: 600 }}>Authentication Providers.</span> If you choose to sign in via Apple or Google, those providers may share certain information with us as described in their respective privacy policies. We encourage you to review the privacy policies of these providers.
        </P>
        <P t={t}>
          (d) <span style={{ fontWeight: 600 }}>Hosting and Infrastructure.</span> We use third-party hosting and infrastructure providers (e.g., Netlify, cloud services) to deliver the Service. These providers may process your data as part of delivering their services.
        </P>
        <P t={t}>
          (e) <span style={{ fontWeight: 600 }}>Payment Processors.</span> In-app purchases are processed through platform payment systems (Apple App Store, Google Play). We do not receive or store your full payment credentials.
        </P>

        {/* 9 */}
        <SectionHead t={t}>9. International Data Transfers</SectionHead>
        <P t={t}>
          9.1. Your information may be transferred to, and processed in, countries other than the country in which you are resident. These countries may have data protection laws that are different from the laws of your country.
        </P>
        <P t={t}>
          9.2. If you are located in the European Economic Area, the United Kingdom, or Switzerland, we will ensure that transfers of your personal data to countries outside those areas are subject to appropriate safeguards, including Standard Contractual Clauses approved by the European Commission or other legally recognized transfer mechanisms.
        </P>
        <P t={t}>
          9.3. By using the Service, you consent to the transfer of your information to the United States and other countries where Mahji and its service providers operate.
        </P>

        {/* 10 */}
        <SectionHead t={t}>10. Do Not Track Signals</SectionHead>
        <P t={t}>
          10.1. Some browsers include a "Do Not Track" ("DNT") feature that signals to websites and services that you do not want to be tracked. Because there is no accepted standard for how to respond to DNT signals, the Service does not currently respond to DNT browser signals or headers. We will continue to monitor developments regarding DNT standards and may adopt a standard once one is established.
        </P>

        {/* 11 */}
        <SectionHead t={t}>11. Cookies and Similar Technologies</SectionHead>
        <P t={t}>
          11.1. The Service primarily uses local storage rather than traditional browser cookies for storing preferences and settings. Local storage data (such as theme preference, sound toggle state, and voice narrator selection) is stored only on your device and is not transmitted to our servers unless necessary for account functionality.
        </P>
        <P t={t}>
          11.2. Third-party services integrated with the Service (such as analytics providers) may use cookies or similar tracking technologies. You can manage your cookie preferences through your browser settings.
        </P>

        {/* 12 */}
        <SectionHead t={t}>12. Changes to This Policy</SectionHead>
        <P t={t}>
          12.1. We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the updated Policy within the Service and updating the "Last Updated" date at the top of this page. For material changes, we may also provide additional notice (such as an in-app notification or an email to the address associated with your account).
        </P>
        <P t={t}>
          12.2. Your continued use of the Service after the effective date of the revised Policy constitutes your acceptance of the updated terms. We encourage you to review this Policy periodically to stay informed about how we are protecting your information.
        </P>

        {/* 13 */}
        <SectionHead t={t}>13. Contact Information</SectionHead>
        <P t={t}>
          If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
        </P>
        <P t={t}>
          Mahji LLC{'\n'}
          <br />Email: legal@mahji.com
        </P>
        <P t={t}>
          For data protection inquiries from European residents, you may also contact our designated representative at the address above.
        </P>
        <P t={t}>
          If you have an unresolved privacy or data use concern that we have not addressed satisfactorily, please contact your local data protection authority.
        </P>

        <div style={{ height: 40 }} />
      </Cnt>
    </>
  );
}
