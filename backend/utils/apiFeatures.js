class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  algorithm(skills) {
    let keywords = [];
    
    skills.forEach((e) => {
      keywords.push(e.title);
    });

    this.query = this.query.find({
      _id: {
        $ne: this.queryStr.id,
      },
      offeringSkills: {
        $elemMatch: {
          title: {
            $regex: keywords.join("|"),
            $options: "i",
          },
        },
      }
    });
    
    return this;
  }

  filter() {
    // Search Filter

    const keywords = this.queryStr.keyword ? {
      $regex: this.queryStr.keyword.join("|"),
      $options: "i",
    } : {
      $regex: "",
    };

    // Experience Filter
    
    let exp = this.queryStr.experience ? this.queryStr.experience.split(" ")[0] : "";
    let obj1 = {
      $nin: [],
    };

    if (exp == 2) {
      obj1 = {
        $nin: ["1 years"],
      }
    } else if (exp == 3) {
      obj1 = {
        $nin: ["1 years", "2 years"],
      }
    }

    // Work Level Filter

    let workLvl = this.queryStr.workLevel ? this.queryStr.workLevel.split("-")[0] : "";
    let obj2 = {
      $nin: [],
    };

    if (workLvl === "Intermediate") {
      obj2 = {
        $nin: ["Beginner-Level"],
      }
    } else if (workLvl === "Expert") {
      obj2 = {
        $nin: ["Beginner-Level", "Intermediate-Level"],
      }
    }

    // Applying All Filters

    this.query = this.query.find({
      offeringSkills: {
        $elemMatch: {
          title: keywords,
          experience: obj1,
          workLevel: obj2,
        },
      },
    });

    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;

    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
}

module.exports = ApiFeatures;