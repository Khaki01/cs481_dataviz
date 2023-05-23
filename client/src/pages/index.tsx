import Container from '@mui/material/Container';
import TypeWriter from 'typewriter-effect';
import Typography from '@mui/material/Typography';

export default function Home() {
  return (
    <Container>
      <main>
        <Typography variant="h1" color="primary">
          <TypeWriter
            options={{
              strings: ['Explore patterns towards healthier life!'],
              autoStart: true,
              loop: true,
            }}
          />
        </Typography>
      </main>
    </Container>
  );
}
