// Flutter Worker Mobile Application Structure
// Demonstrates Worker login, live gas monitoring, AI alerts, voice-guided routes, SOS panic buttons.

import 'package:flutter/material.dart';

void main() {
  runApp(const MineGuardianApp());
}

class MineGuardianApp extends StatelessWidget {
  const MineGuardianApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MineGuardian X Mobile',
      theme: ThemeData.dark().copyWith(
        primaryColor: const Color(0xFF00D4FF),
        scaffoldBackgroundColor: const Color(0xFF050B18),
      ),
      home: const WorkerDashboardScreen(),
    );
  }
}

class WorkerDashboardScreen extends StatefulWidget {
  const WorkerDashboardScreen({super.key});

  @override
  State<WorkerDashboardScreen> createState() => _WorkerDashboardScreenState();
}

class _WorkerDashboardScreenState extends State<WorkerDashboardScreen> {
  int _riskScore = 14;
  double _coLevel = 1.8;
  double _methaneLevel = 0.05;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('MINEGUARDIAN X', style: TextStyle(fontFamily: 'monospace')),
        backgroundColor: const Color(0xFF0D1B2A),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Risk Circle
            Card(
              color: const Color(0xFF0D1B2A),
              shape: RoundedRectangleBorder(
                side: const BorderSide(color: Color(0xFF00D4FF), width: 1.0),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  children: [
                    const Text('ACRSA RISK VALUE', style: TextStyle(color: Colors.grey)),
                    const SizedBox(height: 12),
                    CircleAvatar(
                      radius: 40,
                      backgroundColor: Colors.transparent,
                      child: Container(
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(color: const Color(0xFF00D4FF), width: 3),
                        ),
                        alignment: Alignment.center,
                        child: Text('$_riskScore%', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),
            // Gas levels indicators
            Row(
              children: [
                Expanded(
                  child: Card(
                    color: const Color(0xFF132235),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('CO LEVEL', style: TextStyle(fontSize: 10, color: Colors.grey)),
                          Text('$_coLevel ppm', style: const TextStyle(fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Card(
                    color: const Color(0xFF132235),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('METHANE (CH4)', style: TextStyle(fontSize: 10, color: Colors.grey)),
                          Text('$_methaneLevel % LEL', style: const TextStyle(fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const Spacer(),
            // Big SOS Panic Trigger
            ElevatedButton.icon(
              onPressed: () {
                // Send SOS distress signals via local ESP-NOW mesh networking
              },
              icon: const Icon(Icons.warning, color: Colors.white),
              label: const Text('SOS EMERGENCY TRIGGER', style: TextStyle(fontWeight: FontWeight.bold)),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red[700],
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
