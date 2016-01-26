class ProposalVoteHelper {

  getSpentPercentage(budget, creditsSpent) {
    const percentage = creditsSpent > 0 && budget > 0
      ? creditsSpent / budget * 100
      : 0;
    return Math.round(percentage * 100) / 100;
  }

}

export default new ProposalVoteHelper();
