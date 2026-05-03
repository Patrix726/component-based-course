<script lang="ts">
	import { Button, Card } from '@component-based-software/ui';
	import { goto } from '$app/navigation';

	function goToLogin() {
		goto('/login');
	}
</script>

<div class="landing-page">
	<!-- Hero Section -->
	<section class="hero-section">
		<div class="hero-content">
			<div class="hero-text">
				<h1 class="hero-title">
					<span class="chess-piece">♔</span>
					Chess Tournament
					<span class="chess-piece">♛</span>
					Management
				</h1>
				<p class="hero-subtitle">
					Create, manage, and compete in chess tournaments with ease.
					Real-time clocks, automated pairings, and comprehensive standings.
				</p>
				<div class="hero-actions">
					<Button size="lg" on:click={goToLogin}>
						Get Started
					</Button>
					<Button variant="outline" size="lg">
						Learn More
					</Button>
				</div>
			</div>

			<div class="hero-visual">
				<div class="chess-board">
					<div class="board-squares">
						{#each Array(64) as _, i}
							<div class="square {(i + Math.floor(i / 8)) % 2 === 0 ? 'light' : 'dark'}">
								{#if i === 27}
									<span class="piece white">♔</span>
								{:else if i === 28}
									<span class="piece black">♛</span>
								{:else if i === 35}
									<span class="piece white">♞</span>
								{:else if i === 36}
									<span class="piece black">♜</span>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>

		<!-- Floating elements -->
		<div class="floating-blob blob-1"></div>
		<div class="floating-blob blob-2"></div>
		<div class="floating-blob blob-3"></div>
	</section>

	<!-- Features Section -->
	<section class="features-section">
		<div class="container">
			<h2 class="section-title">Why Choose Our Platform?</h2>
			<div class="features-grid">
				<Card class="feature-card">
					<div class="feature-icon">⏱️</div>
					<h3>Real-time Clocks</h3>
					<p>Precise time management with synchronized clocks for fair play.</p>
				</Card>

				<Card class="feature-card">
					<div class="feature-icon">🏆</div>
					<h3>Automated Pairings</h3>
					<p>Swiss system pairings and round-robin tournaments handled automatically.</p>
				</Card>

				<Card class="feature-card">
					<div class="feature-icon">📊</div>
					<h3>Live Standings</h3>
					<p>Real-time leaderboard updates and comprehensive tournament statistics.</p>
				</Card>

				<Card class="feature-card">
					<div class="feature-icon">📱</div>
					<h3>Cross-platform</h3>
					<p>Works seamlessly on desktop and mobile devices.</p>
				</Card>

				<Card class="feature-card">
					<div class="feature-icon">🔒</div>
					<h3>Secure & Private</h3>
					<p>Club-based tournaments with admin controls and secure authentication.</p>
				</Card>

				<Card class="feature-card">
					<div class="feature-icon">🎯</div>
					<h3>Easy Management</h3>
					<p>Intuitive admin interface for tournament creation and result entry.</p>
				</Card>
			</div>
		</div>
	</section>
</div>

<style>
	.landing-page {
		min-height: 100vh;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		position: relative;
		overflow: hidden;
	}

	/* Hero Section */
	.hero-section {
		padding: 4rem 2rem 8rem;
		position: relative;
		min-height: 80vh;
		display: flex;
		align-items: center;
	}

	.hero-content {
		max-width: 1200px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4rem;
		align-items: center;
	}

	.hero-text {
		color: white;
	}

	.hero-title {
		font-size: 3.5rem;
		font-weight: 800;
		line-height: 1.1;
		margin-bottom: 1.5rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.chess-piece {
		font-size: 2.5rem;
		filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
	}

	.hero-subtitle {
		font-size: 1.25rem;
		line-height: 1.6;
		opacity: 0.9;
		margin-bottom: 2.5rem;
		max-width: 500px;
	}

	.hero-actions {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	/* Chess Board */
	.hero-visual {
		display: flex;
		justify-content: center;
	}

	.chess-board {
		width: 300px;
		height: 300px;
		border-radius: 1rem;
		overflow: hidden;
		box-shadow: 0 20px 40px rgba(0,0,0,0.3);
		background: #f0d9b5;
		position: relative;
	}

	.board-squares {
		display: grid;
		grid-template-columns: repeat(8, 1fr);
		width: 100%;
		height: 100%;
	}

	.square {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.square.light {
		background-color: #f0d9b5;
	}

	.square.dark {
		background-color: #b58863;
	}

	.piece {
		font-size: 2rem;
		text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
	}

	.piece.white {
		color: #ffffff;
		text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
	}

	.piece.black {
		color: #2d1810;
	}

	/* Floating Blobs */
	.floating-blob {
		position: absolute;
		border-radius: 50%;
		background: rgba(255,255,255,0.1);
		animation: float 6s ease-in-out infinite;
		pointer-events: none;
	}

	.blob-1 {
		width: 200px;
		height: 200px;
		top: 10%;
		right: 10%;
		animation-delay: 0s;
	}

	.blob-2 {
		width: 150px;
		height: 150px;
		bottom: 20%;
		left: 15%;
		animation-delay: 2s;
	}

	.blob-3 {
		width: 100px;
		height: 100px;
		top: 50%;
		right: 20%;
		animation-delay: 4s;
	}

	@keyframes float {
		0%, 100% { transform: translateY(0px) rotate(0deg); }
		33% { transform: translateY(-20px) rotate(120deg); }
		66% { transform: translateY(10px) rotate(240deg); }
	}

	/* Features Section */
	.features-section {
		background: white;
		padding: 4rem 2rem;
		position: relative;
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
	}

	.section-title {
		font-size: 2.5rem;
		font-weight: 700;
		text-align: center;
		margin-bottom: 3rem;
		color: #1f2937;
	}

	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
	}

	.feature-card {
		text-align: center;
		padding: 2rem;
		transition: transform 0.3s ease, box-shadow 0.3s ease;
		border: none;
		box-shadow: 0 4px 6px rgba(0,0,0,0.1);
	}

	.feature-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 10px 25px rgba(0,0,0,0.15);
	}

	.feature-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.feature-card h3 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: #1f2937;
	}

	.feature-card p {
		color: #6b7280;
		line-height: 1.6;
	}

	/* Dark mode support */
	@media (prefers-color-scheme: dark) {
		.landing-page {
			background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
		}

		.features-section {
			background: #111827;
		}

		.section-title {
			color: #f3f4f6;
		}

		.feature-card h3 {
			color: #f3f4f6;
		}

		.feature-card p {
			color: #9ca3af;
		}
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.hero-content {
			grid-template-columns: 1fr;
			gap: 2rem;
			text-align: center;
		}

		.hero-title {
			font-size: 2.5rem;
		}

		.chess-board {
			width: 250px;
			height: 250px;
		}

		.hero-section {
			padding: 2rem 1rem 4rem;
		}

		.features-section {
			padding: 2rem 1rem;
		}

		.section-title {
			font-size: 2rem;
		}

		.hero-actions {
			justify-content: center;
		}
	}
</style>
