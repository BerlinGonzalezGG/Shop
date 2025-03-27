import {
  Tailwind,
  Container,
  Html,
  Body,
  Heading,
  Text,
  Img,
  Font,
  Head,
  Row,
  Column,
  Link,
} from "@react-email/components";

const calculateTotal = async (order) => {
  let newTotal = 0;
  order.items.forEach((product) => {
    newTotal += Number(product.price) * product.quantity * order.currency.price;
  });
  return newTotal;
};

const userPaymentConfirmed = async (order) => {
  const total = await calculateTotal(order);

  const stripeFee = Number(
    (total * (order.currency.value === "usd" ? 2.6 : 3.5)) / 100 +
      0.3 * order.currency.price
  );

  return (
    <Html lang="en">
      <Head>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Tailwind>
        <Body
          className="bg-[#0A0A0A] w-full p-10 flex justify-center"
          style={{ fontFamily: "Roboto, Verdana, sans-serif" }}
        >
          <Container
            style={{ minWidth: "750px" }}
            className="bg-[#1A1A1A] p-10 rounded-md shadow-md"
          >
            <Img
              src="https://utfs.io/f/48a21b41-6d1b-4c82-beac-5a0c65ff87ce-xjlur5.png"
              alt="Logo"
              width="400"
              height="125"
            />
            <Heading
              className="text-3xl text-white font-semibold mt-2"
              style={{ fontFamily: "Roboto, Verdana, sans-serif" }}
            >
              Hi,{" "}
              {order.shipping.discord
                ? order.shipping.discord
                : order.shipping.email.split("@")[0]}
              ! Order #{order._id.toString().slice(-5).toUpperCase()}
            </Heading>
            <Text
              className="text-xl text-white mb-4"
              style={{ fontFamily: "Roboto, Verdana, sans-serif" }}
            >
              Thanks for your purchase on BerlinGonzalez Shop
            </Text>

            <Row>
              <Column>
                <Text
                  className="text-lg text-gray-300 font-semibold mb-2"
                  style={{
                    width: "312px",
                    fontFamily: "Roboto, Verdana, sans-serif",
                  }}
                >
                  User info.
                </Text>
              </Column>
              <Column>
                <Text
                  className="text-lg text-gray-300 font-semibold mb-2"
                  style={{
                    width: "314px",
                    fontFamily: "Roboto, Verdana, sans-serif",
                  }}
                >
                  Payment Details
                </Text>
              </Column>
            </Row>
            <Container
              style={{ minWidth: "670px" }}
              className="bg-[#2A2A2A] rounded-md mb-6 px-4 py-1"
            >
              <Row>
                <Column style={{ width: "314px" }}>
                  <Text
                    className="text-sm text-gray-300"
                    style={{ fontFamily: "Roboto, Verdana, sans-serif" }}
                  >
                    Email: {order.shipping.email}
                  </Text>
                  <Text
                    className="text-sm text-gray-300"
                    style={{ fontFamily: "Roboto, Verdana, sans-serif" }}
                  >
                    Discord: {order.shipping.discord}
                  </Text>
                  <Text
                    className="text-sm text-gray-300"
                    style={{ fontFamily: "Roboto, Verdana, sans-serif" }}
                  >
                    Phone: {order.shipping.phone}
                  </Text>
                </Column>

                <Column style={{ width: "314px" }}>
                  <Text
                    className="text-sm text-gray-300"
                    style={{ fontFamily: "Roboto, Verdana, sans-serif" }}
                  >
                    Method: {order.payment.method}
                  </Text>
                  <Text
                    className="text-sm text-gray-300"
                    title={order.payment.id}
                    style={{
                      fontFamily: "Roboto, Verdana, sans-serif",
                      width: "250px", // Ajusta el ancho según necesites
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    Payment ID: {order.payment.id}
                  </Text>

                  <Text
                    className="text-sm text-gray-300"
                    style={{ fontFamily: "Roboto, Verdana, sans-serif" }}
                  >
                    Date: {new Date(order.timestamp).toLocaleDateString()}
                  </Text>
                </Column>
              </Row>
            </Container>

            <Text
              className="text-lg text-gray-300 font-semibold mb-2"
              style={{ fontFamily: "Roboto, Verdana, sans-serif" }}
            >
              Order Details
            </Text>
            <Container
              style={{ minWidth: "670px" }}
              className="bg-[#2A2A2A] rounded-md mb-6 px-4 py-1"
            >
              {order.items.map((item, index) => (
                <Row key={index}>
                  <Column>
                    <Text
                      className="text-sm text-gray-300"
                      style={{ fontFamily: "Roboto, Verdana, sans-serif" }}
                    >
                      {item.name}
                    </Text>
                  </Column>
                  <Column>
                    <Text
                      className="text-sm text-gray-300 text-right"
                      style={{ fontFamily: "Roboto, Verdana, sans-serif" }}
                    >
                      $
                      {(
                        item.price *
                        item.quantity *
                        order.currency.price
                      ).toFixed(2)}{" "}
                      {order.currency.label}
                    </Text>
                  </Column>
                </Row>
              ))}
              {order.payment.method === "stripe" && (
                <Row>
                  <Column>
                    <Text
                      className="text-sm text-gray-300"
                      style={{ fontFamily: "Roboto, Verdana, sans-serif" }}
                    >
                      Stripe Fee
                    </Text>
                  </Column>
                  <Column>
                    <Text
                      className="text-sm text-gray-300 text-right"
                      style={{ fontFamily: "Roboto, Verdana, sans-serif" }}
                    >
                      ${stripeFee.toFixed(2)} {order.currency.label}
                    </Text>
                  </Column>
                </Row>
              )}
              <Row>
                <Column>
                  <Text
                    className="text-lg text-white font-semibold"
                    style={{ fontFamily: "Roboto, Verdana, sans-serif" }}
                  >
                    Total
                  </Text>
                </Column>
                <Column>
                  <Text
                    className="text-lg text-white font-semibold text-right"
                    style={{ fontFamily: "Roboto, Verdana, sans-serif" }}
                  >
                    $
                    {order.payment.method == "stripe"
                      ? Number(total + stripeFee).toFixed(2)
                      : total.toFixed(2)}{" "}
                    {order.currency.label}
                  </Text>
                </Column>
              </Row>
            </Container>
            <Text
              className="text-sm text-gray-400"
              style={{ fontFamily: "Roboto, Verdana, sans-serif" }}
            >
              If you have any questions about your order, feel free to contact
              us at support@berlingonzalez.shop.
            </Text>
            <Text
              className="text-sm text-gray-400"
              style={{ fontFamily: "Roboto, Verdana, sans-serif" }}
            >
              © {new Date().getFullYear()} BerlinGonzalez Shop, LLC.. All Rights
              Reserved.{" "}
              {/*<Link
                className="text-sm text-gray-400"
                href="https://rusher.net.ar"
              >
                — by rusher
              </Link>*/}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default userPaymentConfirmed;
