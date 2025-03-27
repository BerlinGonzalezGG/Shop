import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata = {
  title: "Privacy",
};

const PrivacyPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-gray-50 ">
      <Navbar />
      <main className="flex-1 w-full px-[20%] flex items-start justify-center">
        <div className="flex flex-col justify-start overflow-y-scroll pt-[120px] pb-10">
          <h3 className="text-5xl font-semibold">PRIVACY POLICY</h3>
          <div className="my-2">
            <h4>
              BerlinGonzalez Shop values your privacy and the protection of your
              personal data. This privacy policy describes what information we
              collect from you, how we collect it, how we use it, how we obtain
              your consent, how long we keep it in our databases and, if
              necessary, with whom we share it.
            </h4>
            <p className="text-xs text-gray-400">
              By visiting the website and purchasing the products, you are
              accepting the practices described in this privacy policy. Your use
              of the website and purchase of the products are also subject to
              our terms and conditions. In this privacy policy, the words
              "website" refers to BerlinGonzalez Shop website, "we", "us",
              "our", and "BerlinGonzalez Shop" refers to BerlinGonzalez Shop,
              and "user", “customer”, "you", and “your" refers to you, the user
              and customer of BerlinGonzalez Shop. This privacy policy may
              change from time to time. Your continued use of the website after
              we make changes is deemed to be acceptance of those changes, so
              please check the policy periodically for updates. This privacy
              policy has been developed and is maintained in accordance with all
              applicable state, federal and international laws and regulations.
            </p>
          </div>
          <div className="my-2">
            <h4>General information</h4>
            <p className="text-xs text-gray-400">
              The personal data of the users that are collected and processed
              through the website:
            </p>
            <p className="text-xs text-gray-400">https://berlingonzalez.shop</p>
            <p className="text-xs text-gray-400">
              Will be under responsibility and in charge of:
            </p>
            <p className="text-xs text-gray-400">BerlinGonzalez Shop, LLC.</p>
            <p className="text-xs text-gray-400">
              Email: support@berlingonzalez.shop
            </p>
          </div>
          <div className="my-2">
            <h4>How we obtain your Consent</h4>
            <p className="text-xs text-gray-400">
              By visiting the website, registering on the website through your
              Discord account, placing an order through the available methods,
              contacting us through our contact information and providing us
              with personal information to communicate with you, you consent to
              our collection, storage and use of your information on the terms
              contained in this privacy policy. You may withdraw your consent by
              sending us your request via the contact information or the contact
              page.
            </p>
          </div>
          <div className="my-2">
            <h4>Types of Information Gathered</h4>
            <p className="text-xs text-gray-400">
              The information we collect from our users and customers helps us
              to provide our products effectively and to personalize and
              continually improve the user experience on the website. These are
              the types of information we collect:
            </p>
          </div>
          <div className="my-2">
            <h4>Information You Give Us</h4>
            <p className="text-xs text-gray-400">
              You provide information when you visit the website, register
              through your Discord account, place an order through the available
              methods, and/or communicate with us through our contact
              information. As a result of those actions, you might supply us
              with the following information:
            </p>
            <div className="flex flex-col">
              <p className="text-xs text-gray-400">- First and last name</p>
              <p className="text-xs text-gray-400">- Your in-game username</p>
              <p className="text-xs text-gray-400">- Email address</p>
              <p className="text-xs text-gray-400">- Phone number</p>
              <p className="text-xs text-gray-400">
                - Any additional information relating to you that you provide to
                us directly or indirectly through our website or online presence
                such as ‘cookies’ (for more information, read our cookie
                policy).
              </p>
              <p className="text-xs text-gray-400">
                BerlinGonzalez Shop will not collect any personally identifiable
                information about you unless you provide it.
              </p>
            </div>
          </div>
          <div className="my-2">
            <h4>Automatic Collection of Information</h4>
            <p className="text-xs text-gray-400">
              As you browse our website, certain usage data is automatically
              collected. These include technical information such as the IP
              address of your device, the type and version of your browser, the
              specific pages you visit on our website, the date and time of your
              access, the amount of time you spend on those pages, and other
              diagnostically relevant data. In the case of access via mobile
              devices, we also collect information specific to these devices.
              This may include, but is not limited to, the type of mobile device
              used, its unique identifier, the IP address of the device, the
              mobile operating system and the type of mobile browser, along with
              other identifiers and diagnostic data. In addition, we collect
              information that your browser automatically provides each time you
              visit our website or access our website using a mobile device.
            </p>
          </div>
          <div className="my-2">
            <h4>Logging in through Discord</h4>
            <p className="text-xs text-gray-400">
              To log in to our website, we require users to use their Discord
              account. This login method allows for secure and efficient
              integration, ensuring that your identity is authenticated directly
              by Discord without the need to provide us with a password. By
              using this method, you authorize our website to access certain
              information from your Discord account, including, but not limited
              to, your username, email address, and avatar. This information
              will be used solely for the purpose of authentication and to
              facilitate the purchase of our products. We are committed to
              handling your personal data with the utmost care and in accordance
              with this privacy policy, ensuring that it will not be shared with
              third parties without your explicit consent, except in the
              situations described in our privacy policy. By opting into this
              login method, you agree to our data processing practices and
              confirm that you have read and understood our privacy policy in
              its entirety.
            </p>
          </div>
          <div className="my-2">
            <h4>Payment Information</h4>
            <p className="text-xs text-gray-400">
              Your payment details will be processed by the payment processors
              available on this website (Stripe), which will process and store
              your data securely and for the sole purpose of processing the
              purchase of the products. In the case of payments through
              cryptocurrencies, payments are made in a decentralized manner
              through the virtual wallets of the customers. BerlinGonzalez Shop
              reserves the right to contract any available payment platform.
            </p>
            <p className="text-xs text-gray-400">
              See Stripe's privacy policy here:{" "}
              <a href="https://stripe.com/privacy)">Stripe Privacy Policy</a>
            </p>
          </div>
          <div className="my-2">
            <h4>Google Analytics</h4>
            <p className="text-xs text-gray-400">
              We use Google Analytics provided by Google, Inc., USA (“Google”).
              These tools and technologies collect and analyze certain types of
              information, including IP addresses, device and software
              identifiers, referring and exit URLs, feature use metrics and
              statistics, usage history, media access control address (MAC
              Address), mobile unique device identifiers, and other similar
              information via the use of cookies. The information generated by
              Google Analytics (including your IP address) may be transmitted to
              and stored by Google on servers in the United States. We use the
              GOOGLE Analytics collection of data to enhance the platform and
              improve our service.
            </p>
            <p className="text-xs text-gray-400">
              Please consult Google's privacy policy here:{" "}
              <a href="https://policies.google.com/privacy">
                Google Privacy Policy
              </a>
            </p>
          </div>
          <div className="my-2">
            <h4>Social Media</h4>
            <p className="text-xs text-gray-400">
              On our website, we provide you with various links that allow you
              to interact with social media. We invite you to use these
              functions to share your information as you wish. However, we
              strongly encourage you to review the privacy and data protection
              policies of each of the social media sites you use through our
              website to understand how they handle your personal information.
            </p>
            <div className="flex flex-col">
              <p className="text-xs text-gray-400">
                - Instagram:{" "}
                <a href="http://instagram.com/about/legal/privacy/">
                  Instagram Privacy Policy
                </a>
              </p>
              <p className="text-xs text-gray-400">
                - TikTok:{" "}
                <a href="https://www.tiktok.com/legal/page/row/privacy-policy/en">
                  TikTok Privacy Policy
                </a>
              </p>
              <p className="text-xs text-gray-400">
                - WhatsApp:{" "}
                <a href="https://www.whatsapp.com/privacy">
                  WhatsApp Privacy Policy
                </a>
              </p>
              <p className="text-xs text-gray-400">
                - X (Twitter):{" "}
                <a href="https://twitter.com/privacy">
                  X (Twitter) Privacy Policy
                </a>
              </p>
              <p className="text-xs text-gray-400">
                - Discord:{" "}
                <a href="https://discord.com/privacy">Discord Privacy Policy</a>
              </p>
            </div>
          </div>
          <div className="my-2">
            <h4>Contact Information</h4>
            <p className="text-xs text-gray-400">
              We may access some personal information about the user, such as
              name and email address, when the user or any third party
              communicates with us through our contact information. Personal
              information provided through our contact information is not stored
              on any BerlinGonzalez Shop server and will be stored on the
              respective server of our email service.
            </p>
          </div>
          <div className="my-2">
            <h4>How long we keep your data</h4>
            <p className="text-xs text-gray-400">
              Personal data provided by users and customers through the website
              will be retained for the time necessary to deliver the products,
              fulfill the legitimate purposes described in this policy and/or
              until the user requests the deletion of their data. BerlinGonzalez
              Shop may be allowed to retain personal data for a longer period
              whenever the user has given consent to such processing, as long as
              such consent is not withdrawn. Furthermore, BerlinGonzalez Shop
              may be obliged to retain personal data for a longer period
              whenever required to do so for the performance of a legal
              obligation or upon order of an authority. Once the retention
              period expires, personal data shall be deleted. Therefore, the
              right to access, the right to erasure, the right to rectification
              and the right to data portability cannot be enforced after
              expiration of the retention period.
            </p>
          </div>
          <div className="my-2">
            <h4>How we use your information (legitimate purposes)</h4>
            <p className="text-xs text-gray-400">
              In general, we use the information we collect primarily to
              provide, maintain, protect and improve our current website and
              products. We use personal information collected through our
              website as described below:
            </p>
            <div className="flex flex-col">
              <p className="text-xs text-gray-400">
                - Identify you as a user in our system.
              </p>
              <p className="text-xs text-gray-400">
                - Facilitate the registration of users through their Discord
                accounts.
              </p>
              <p className="text-xs text-gray-400">
                - Process the orders through the available methods.
              </p>
              <p className="text-xs text-gray-400">- Process order payments.</p>
              <p className="text-xs text-gray-400">
                - Verify the identity of our customers (KYC).
              </p>
              <p className="text-xs text-gray-400">
                - Process cryptocurrency payments and credit BerlinGonzalez Shop
                to the user's account balance.
              </p>
              <p className="text-xs text-gray-400">
                - Send the products or items to the customer's in-game accounts.
              </p>
              <p className="text-xs text-gray-400">
                - Process refund requests from customers.
              </p>
              <p className="text-xs text-gray-400">
                - Understand and enhance your experience using our website and
                products.
              </p>
              <p className="text-xs text-gray-400">
                - Respond to your comments or questions through our support
                team.
              </p>
              <p className="text-xs text-gray-400">
                - Send you related information, including confirmations,
                invoices, technical notices, updates, security alerts, and
                support and administrative messages.
              </p>
              <p className="text-xs text-gray-400">
                - Communicate with you about upcoming events, offers, and news
                about our products.
              </p>
              <p className="text-xs text-gray-400">
                - Marketing purposes of BerlinGonzalez Shop.
              </p>
              <p className="text-xs text-gray-400">
                - Link or combine your information with other information we get
                from third parties to help understand your needs and provide you
                with better service.
              </p>
              <p className="text-xs text-gray-400">
                - Process and respond to requests related to users' privacy
                rights.
              </p>
              <p className="text-xs text-gray-400">
                - Protect, investigate and deter against fraudulent,
                unauthorized or illegal activity.
              </p>
            </div>
          </div>
          <div className="my-2">
            <h4>How we share information</h4>
            <p className="text-xs text-gray-400">
              The personal information of our customers and users is an
              important and fundamental part of our business. Under no
              circumstances will we sell or share information with third parties
              that has not been previously authorized by the user, customer, or
              owner of the personal data. We share user and customer information
              only and exclusively as described below.
            </p>
          </div>
          <div className="my-2">
            <h4>Third-Party Service Providers</h4>
            <p className="text-xs text-gray-400">
              We use third-party services to perform certain functions on our
              website. Some of these functions and services include: website
              creation and hosting, payment processing (Stripe), login
              (Discord), product delivery, email delivery, and data analysis
              (Google Analytics). These third-party services and tools may have
              access to personal information needed to perform their functions,
              but may not use that information for other purposes. Information
              shared with these third-party services will be treated and stored
              in accordance with their respective privacy policies and our
              privacy policy.
            </p>
          </div>

          <div className="my-2">
            <h4>Marketing</h4>
            <p className="text-xs text-gray-400">
              By providing your information and placing an order, you consent to
              the use of your personal information, including name, email
              address, and phone number for the sole purpose of sending you
              marketing communications about our products. BerlinGonzalez Shop
              respects your privacy and does not share this information with
              unaffiliated third parties. If you wish to stop receiving
              marketing communications, you may unsubscribe at any time by using
              the "unsubscribe" option available in the same marketing emails or
              by submitting your request through our contact information.
            </p>
          </div>

          <div className="my-2">
            <h4>Business Transfers</h4>
            <p className="text-xs text-gray-400">
              In the event that BerlinGonzalez Shop creates, merges with, or is
              acquired by another entity, your information will most likely be
              transferred. BerlinGonzalez Shop will email you or place a
              prominent notice on our website before your information becomes
              subject to another privacy policy.
            </p>
          </div>

          <div className="my-2">
            <h4>Protection of BerlinGonzalez Shop and Others</h4>
            <p className="text-xs text-gray-400">
              We release personal information when we believe release is
              appropriate to comply with the law, enforce or apply our Terms and
              Conditions and other agreements, or protect the rights , property,
              or safety of BerlinGonzalez Shop, our users or others. This
              includes exchanging information with other companies and
              organizations for fraud protection and credit risk reduction.
            </p>
          </div>

          <div className="my-2">
            <h4>With Your Consent</h4>
            <p className="text-xs text-gray-400">
              Other than as set out above, you will receive notice when
              personally identifiable information about you might go to third
              parties, and you will have an opportunity to choose not to share
              the information.
            </p>
          </div>

          <div className="my-2">
            <h4>Anonymous Information</h4>
            <p className="text-xs text-gray-400">
              BerlinGonzalez Shop uses the anonymous browsing information
              collected automatically by our servers primarily to help us
              administer and improve the website. We may also use aggregated
              anonymous information to provide information about the website to
              potential business partners and other unaffiliated entities. This
              information is not personally identifiable.
            </p>
          </div>

          <div className="my-2">
            <h4>Protecting your information</h4>
            <p className="text-xs text-gray-400">
              We grant access to your personal information only to those outside
              persons or services that have a legitimate need to know it and in
              accordance with our privacy policy. We adhere to
              industry-recognized security standards to protect your personal
              information, both during transmission and in storage. However, it
              is important to note that no method of transmission over the
              Internet or electronic storage is foolproof and 100% secure.
              Therefore, while we at BerlinGonzalez Shop strive to implement
              commercially viable data protection methods, we cannot ensure the
              absolute security of your personal information. We undertake not
              to sell, distribute, or transfer your personal data to
              unauthorized third parties unless we have your explicit consent or
              are required by law to do so.
            </p>
          </div>

          <div className="my-2">
            <h4>Data breach notifications</h4>
            <p className="text-xs text-gray-400">
              In the event of a security breach that compromises the
              confidentiality of our users' personal data, BerlinGonzalez Shop
              undertakes to notify those affected in a timely manner. This
              notification will be made through the means of contact that have
              been provided by the user on our platform. We will take all
              reasonable measures to protect the information and remedy any
              situation that jeopardizes the security of your data.
            </p>
          </div>

          <div className="my-2">
            <h4>International data transfer</h4>
            <p className="text-xs text-gray-400">
              By using our website, you agree that your personal data may be
              transferred and processed outside the United States, where data
              protection laws may differ. BerlinGonzalez Shop is committed to
              taking the necessary steps to ensure that your data is treated in
              accordance with applicable privacy protection rules and is
              adequately protected during any international transfer.
            </p>
          </div>

          <div className="my-2">
            <h4>Rights</h4>
            <p className="text-xs text-gray-400">
              Users who provide information through our website, as data
              subjects and data owners, have the right to access, rectify,
              download or delete their information, as well as to restrict and
              object to certain processing of their information. While some of
              these rights apply generally, others apply only in certain limited
              circumstances. We describe these rights below:
            </p>
            <div className="flex flex-col">
              <p className="text-xs text-gray-400">
                - Access and portability: To access and know what information is
                stored in our servers, you can send us your request through our
                contact information.
              </p>
              <p className="text-xs text-gray-400">
                - Rectify, Restrict, Limit and/or Delete: You can also rectify,
                restrict, limit or delete much of your information.
              </p>
              <p className="text-xs text-gray-400">
                - Right to be informed: Users of our website will be informed,
                upon request, about what data we collect, how it is used, how
                long it is retained and whether it is shared with third parties.
              </p>
              <p className="text-xs text-gray-400">
                - Object: When we process your information based on our
                legitimate interests as explained above, or in the public
                interest, you may object to this processing in certain
                circumstances. In such cases, we will stop processing your
                information unless we have compelling legitimate reasons to
                continue processing it or where it is necessary for legal
                reasons.
              </p>
              <p className="text-xs text-gray-400">
                - Revoke consent: Where you have previously given your consent,
                such as to allow us to process and store your personal
                information, you have the right to revoke your consent to the
                processing and storage of your information at any time. For
                example, you may withdraw your consent by updating your
                settings. In certain cases, we may continue to process your
                information after you have withdrawn your consent if we have a
                legal basis for doing so or if your withdrawal of consent was
                limited to certain processing activities.
              </p>
              <p className="text-xs text-gray-400">
                - Complaint: If you wish to file a complaint about our use of
                your information (and without prejudice to any other rights you
                may have), you have the right to do so with your local
                supervisory authority. Users can exercise all these rights by
                contacting us through the contact information or contact page.
              </p>
              <p className="text-xs text-gray-400">
                - Rights related to automated decision-making, including
                profiling: Website users may request that we provide a copy of
                the automated processing activities we conduct if they believe
                that data is being unlawfully processed.
              </p>
            </div>
            <p className="text-xs text-gray-400">
              Users or holders of personal data provided through the platform
              may exercise these rights over their personal data at any time and
              without limitation by sending their request through our contact
              information or contact form. The request to exercise their rights
              will be attended and answered within a maximum period of 10
              working days.
            </p>
          </div>

          <div className="my-2">
            <h4>Children's online privacy protection</h4>
            <p className="text-xs text-gray-400">
              We comply with the requirements of national and international data
              protection regulations regarding the protection of personal data
              of minors. Although the website and products are available to all
              ages, we do not collect any information from children under the
              age of 13. If we become aware that a child under 13 has provided
              us with personal information we will take immediate steps to
              delete such information.
            </p>
          </div>

          <div className="my-2">
            <h4>Third parties</h4>
            <p className="text-xs text-gray-400">
              Except as otherwise expressly included in this privacy policy,
              this document addresses only the use and disclosure of information
              BerlinGonzalez Shop collects from you. If you disclose your
              information to others, whether other users or suppliers on
              BerlinGonzalez Shop, different rules may apply to their use or
              disclosure of the information you disclose to them. BerlinGonzalez
              Shop does not control the privacy policies of third parties, and
              you are subject to the privacy policies of those third parties
              where applicable. BerlinGonzalez Shop is not responsible for the
              privacy or security practices of other websites on the Internet,
              even those linked to or from our website. Please review the
              privacy policies of third-party websites or services that you
              access through the BerlinGonzalez Shop website.
            </p>
          </div>

          <div className="my-2">
            <h4>Changes to privacy policy</h4>
            <p className="text-xs text-gray-400">
              We reserve the right to change our privacy policy at any time.
              Changes will be promptly notified to our users or customers and
              posted on the website. Your continued use of our website following
              such changes will signify your acceptance of the changes.
            </p>
          </div>

          <div className="my-2">
            <h4>Contact us</h4>
            <p className="text-xs text-gray-400">
              If you have questions or concerns about this privacy policy and
              the handling and security of your data, please contact us through
              our contact page or via the contact information below:
            </p>
            <p className="text-xs text-gray-400">BerlinGonzalez Shop, LLC.</p>
            <p className="text-xs text-gray-400">
              Email: support@berlingonzalez.shop
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPage;
