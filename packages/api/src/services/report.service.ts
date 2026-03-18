import { reportRepository } from "../repositories/report.repository";

export const reportService = {
  async createReport(
    reporterId: string,
    targetType: string,
    targetId: string,
    reason: string,
    description?: string
  ) {
    return reportRepository.create({
      reporterId,
      targetType,
      targetId,
      reason,
      description,
    });
  },

  async getMyReports(userId: string) {
    return reportRepository.findByReporter(userId);
  },

  async getAllReports(status?: string, page?: number, limit?: number) {
    return reportRepository.findAll({ status, page, limit });
  },

  async updateReportStatus(id: string, status: string) {
    return reportRepository.updateStatus(id, status);
  },
};
