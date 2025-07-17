const cron = require('node-cron');
const { generateAndSaveInsights } = require('./geminiInsights');
const prisma = require('./prismaClient');

class InsightScheduler {
  constructor() {
    this.jobs = new Map();
    this.isRunning = false;
  }

  // Initialize the scheduler
  init() {
    if (this.isRunning) {
      console.log('Insight scheduler is already running');
      return;
    }

    console.log('Initializing AI Insight Scheduler...');

    // Schedule daily insight generation at 6 AM
    const dailyJob = cron.schedule(
      '0 6 * * *',
      async () => {
        console.log('Running daily insight generation...');
        await this.generateInsightsForAllHospitals();
      },
      {
        scheduled: false,
        timezone: 'UTC',
      }
    );

    this.jobs.set('daily', dailyJob);

    this.isRunning = true;
    console.log('AI Insight Scheduler initialized successfully');
  }

  // Start all scheduled jobs
  start() {
    if (!this.isRunning) {
      this.init();
    }

    this.jobs.forEach((job, name) => {
      job.start();
      console.log(`Started ${name} insight generation job`);
    });

    console.log('All insight generation jobs started');
  }

  // Stop all scheduled jobs
  stop() {
    this.jobs.forEach((job, name) => {
      job.stop();
      console.log(`Stopped ${name} insight generation job`);
    });

    this.isRunning = false;
    console.log('All insight generation jobs stopped');
  }

  // Generate insights for all hospitals
  async generateInsightsForAllHospitals() {
    try {
      console.log('Fetching all hospitals for insight generation...');

      const hospitals = await prisma.hospital.findMany({
        select: { id: true, name: true },
      });

      console.log(`Found ${hospitals.length} hospitals for insight generation`);

      const results = [];

      for (const hospital of hospitals) {
        console.log(`Generating insights for hospital: ${hospital.name}`);

        try {
          const result = await generateAndSaveInsights(hospital.id, 'daily');
          results.push({
            hospitalId: hospital.id,
            hospitalName: hospital.name,
            success: result.success,
            insightCount: result.savedCount || 0,
            error: result.error || null,
          });
        } catch (error) {
          console.error(
            `Error generating insights for hospital ${hospital.name}:`,
            error
          );
          results.push({
            hospitalId: hospital.id,
            hospitalName: hospital.name,
            success: false,
            insightCount: 0,
            error: error.message,
          });
        }

        // Add delay between hospitals to avoid API rate limits
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      console.log('Insight generation completed for all hospitals:', results);
      return results;
    } catch (error) {
      console.error('Error in generateInsightsForAllHospitals:', error);
      throw error;
    }
  }

  // Manually trigger insight generation for a specific hospital
  async triggerInsightGeneration(hospitalId, insightType = 'general') {
    try {
      console.log(
        `Manually triggering insight generation for hospital ${hospitalId}, type: ${insightType}`
      );

      const result = await generateAndSaveInsights(hospitalId, insightType);

      console.log('Manual insight generation completed:', result);
      return result;
    } catch (error) {
      console.error('Error in manual insight generation:', error);
      throw error;
    }
  }

  // Get scheduler status
  getStatus() {
    return {
      isRunning: this.isRunning,
      jobs: Array.from(this.jobs.keys()).map((name) => ({
        name,
        running: this.jobs.get(name).running,
      })),
    };
  }
}

// Create singleton instance
const insightScheduler = new InsightScheduler();

module.exports = insightScheduler;
