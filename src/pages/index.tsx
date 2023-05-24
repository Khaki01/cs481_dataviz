import Container from '@mui/material/Container';
import TypeWriter from 'typewriter-effect';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Image from 'next/image';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import bicycle from '../../public/indoor_bike.svg';
import usingphone from '../../public/phone_using.svg';
import physical from '../../public/physical.png';
import physical_dist from '../../public/physical_dist.png';
import phoneusage_landing from '../../public/phoneusage_landing.png';
import battery1 from '../../public/battery1.png';
import battery2 from '../../public/battery2.png';
import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Link from 'next/link';
import { useSnackbar } from 'notistack';
export default function Home() {
  const { enqueueSnackbar } = useSnackbar();
  return (
    <Container>
      <main>
        <Stack
          sx={{ minHeight: 'calc(100vh - 112px)' }}
          display="flex"
          alignItems="center"
          justifyContent="center"
          direction="row"
          columnGap={2}
        >
          <Image src={bicycle} alt="bicycle" width={300} height={400} />
          <Stack display="flex" direction="column" rowGap={2}>
            <Typography align="center" variant="h4" color="primary">
              Be with us so you can
              <TypeWriter
                options={{
                  strings: [
                    'Achieve your goal',
                    'Unleash potential',
                    'Track your progress',
                  ],
                  autoStart: true,
                  loop: true,
                }}
              />
            </Typography>
            <Button
              href="#activity"
              sx={{ alignSelf: 'center' }}
              size="large"
              color="primary"
              variant="contained"
            >
              Get started
            </Button>
          </Stack>
          <Image src={usingphone} alt="usingphone" width={300} height={400} />
        </Stack>
        <Stack
          id="activity"
          sx={{ minHeight: '100vh' }}
          direction="row"
          display="flex"
          alignItems="center"
        >
          <Box
            display="flex"
            height="100vh"
            alignItems="flex-start"
            justifyContent="center"
            flexDirection="column"
            rowGap={3}
          >
            <Typography variant="h2" color="primary">
              Balance your life, track your move
            </Typography>
            <Typography variant="subtitle1">
              This graph illustrates the users daily physical activity levels. It can
              show the duration or intensity of activities performed throughout the
              day, such as steps taken, distance covered, or active minutes. The
              graph can display bars or lines representing the level of activity for
              each day, enabling users to visualize their activity patterns over
              time.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                component={Link}
                href="/health-activity"
                size="large"
                variant="contained"
                color="primary"
              >
                Try it
              </Button>
              <Button
                variant="outlined"
                href="#usage"
                component={Link}
                endIcon={<KeyboardDoubleArrowDownIcon />}
              >
                Next
              </Button>
            </Stack>
          </Box>
          <Box
            sx={{
              width: '100%',
              height: '100vh',
              position: 'relative',
            }}
          >
            <Image
              style={{ position: 'absolute', top: 120, right: 0 }}
              src={physical}
              alt="physical"
              width={425.6}
              height={250}
            />
            <Image
              style={{ position: 'absolute', bottom: 40, left: 0 }}
              src={physical_dist}
              alt="physical"
              width={425.6}
              height={250}
            />
          </Box>
        </Stack>
        <Stack
          id="usage"
          sx={{ minHeight: '100vh' }}
          direction="row"
          display="flex"
          alignItems="flex-start"
        >
          <Box
            sx={{
              width: '100%',
              height: '100vh',
              position: 'relative',
            }}
          >
            <Image
              height={350}
              quality={100}
              style={{ position: 'absolute', left: 0, top: 200 }}
              src={phoneusage_landing}
              alt="phone_usage_1"
            />
          </Box>
          <Box
            display="flex"
            height="100vh"
            alignItems="flex-start"
            justifyContent="center"
            flexDirection="column"
            maxWidth="50%"
            rowGap={3}
          >
            <Typography color="primary" align="left" variant="h2">
              Maximize your productivity, optimize well-being
            </Typography>
            <Typography variant="subtitle1">
              This graph illustrates the users phone usage on a daily basis. It can
              show the amount of time spent on the phone each day, allowing users to
              visualize their usage patterns over time. The graph can display bars or
              lines representing the duration of phone usage for each day, enabling
              users to identify trends, such as days with higher or lower phone
              usage.
            </Typography>

            <Stack direction="row" spacing={2}>
              <Button
                component={Link}
                href="/phone-usage"
                size="large"
                color="primary"
                variant="contained"
              >
                Try it
              </Button>
              <Button
                variant="outlined"
                href="#battery"
                component={Link}
                endIcon={<KeyboardDoubleArrowDownIcon />}
              >
                Next
              </Button>
            </Stack>
          </Box>
        </Stack>
        <Stack
          id="battery"
          sx={{ minHeight: '100vh' }}
          direction="row"
          display="flex"
          alignItems="flex-start"
        >
          <Box
            display="flex"
            height="100vh"
            alignItems="flex-start"
            justifyContent="center"
            flexDirection="column"
            maxWidth="50%"
            rowGap={3}
          >
            <Typography color="primary" align="left" variant="h2">
              Embrace a healthier lifestyle, charge yourself!
            </Typography>
            <Typography variant="subtitle1">
              Use a battery icon as a visual representation of the users overall
              balance or health. You can design a battery icon that reflects
              different levels of charge or fill based on the users phone usage and
              physical activity. A full or nearly full battery could indicate a
              healthy balance, while a drained or low battery might signify excessive
              phone usage or low physical activity.
            </Typography>
            <Button
              component={Link}
              href="/battery-exploration"
              size="large"
              color="primary"
              variant="contained"
            >
              Try it
            </Button>
          </Box>
          <Box
            sx={{
              width: '100%',
              height: '100vh',
              position: 'relative',
            }}
          >
            <Image
              height={350}
              quality={100}
              style={{ position: 'absolute', right: 0, top: 130 }}
              src={battery2}
              alt="batter1"
            />
            <Image
              height={350}
              quality={100}
              style={{ position: 'absolute', left: 40, bottom: 60 }}
              src={battery1}
              alt="batter1"
            />
          </Box>
        </Stack>
      </main>
    </Container>
  );
}
